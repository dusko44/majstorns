# MajstorNS — Scraper dizajn

## Kontekst

Baza podataka nema ni jednog majstora. Potrebno je jednokratno (i ponovljivo) punjenje
`craftsmen` tabele scrapiranjeom Google Maps rezultata putem SerpApi servisa.

## Cilj

Upisati ~60 majstora po svakoj od 18 kategorija (≈1.000 ukupno, 3 stranice × 20 rezultata) u Supabase `craftsmen` tabelu,
sa tačnim koordinatama, brojevima telefona i google_place_id za dedupliciranje.

---

## Arhitektura

Jedna TypeScript skripta: **`scripts/scrape.ts`**

```
npx tsx scripts/scrape.ts
```

Nema deploy-a, nema infrastrukture. Skripta se pokreće lokalno jednom, može se ponovo pokrenuti
bezbedno (duplikati se preskaču).

---

## Konfiguracija

Dodati u `.env.local` (nije za commit):

```
SERPAPI_KEY=<serpapi api key>
SUPABASE_SERVICE_ROLE_KEY=<iz Supabase dashboard → Settings → API → service_role key>
```

`SUPABASE_SERVICE_ROLE_KEY` je potreban jer RLS blokira javne INSERT operacije na `craftsmen`.

---

## Tok podataka

```
1. Učitaj kategorije iz Supabase → Map<categorySlug, uuid>
2. Za svaku od 18 kategorija:
   a. Pozovi SerpApi (str. 1): engine=google_maps, q="{category.name} Novi Sad", hl=sr, gl=rs
   b. Filtriraj rezultate: lat 45.19–45.34, lng 19.69–19.93 (NS bounding box)
   c. Za svaki rezultat:
      - Slugify naziva firme
      - Proveri jedinstvenost slug-a u bazi
      - INSERT u craftsmen (on conflict google_place_id → skip)
   d. Ako odgovor sadrži next_page_token i stranica < 3: ponovi od (a) sa tokenom
   e. Pauza 300ms između poziva
3. Ispiši summary: X upisano, Y preskočeno, Z API poziva
```

---

## SerpApi poziv

Po kategoriji se šalju do 3 stranice (svaka vraća max 20 rezultata → ~60 po kategoriji).

```
GET https://serpapi.com/search
  engine=google_maps
  q="{categoryName} Novi Sad"
  hl=sr
  gl=rs
  type=search
  api_key=${SERPAPI_KEY}
  next_page_token={token}   ← samo za str. 2 i 3
```

Paginacija: odgovor sadrži `serpapi_pagination.next_page_token` — ako postoji i nismo prešli 3 stranice, šaljemo sledeći poziv s tim tokenom.

### Struktura odgovora

```json
{
  "local_results": [
    {
      "title": "Auto servis Petrović",
      "place_id": "ChIJabc123...",
      "address": "Bulevar oslobođenja 123, Novi Sad 21000",
      "phone": "+381 21 123 456",
      "gps_coordinates": {
        "latitude": 45.2671,
        "longitude": 19.8335
      }
    }
  ]
}
```

---

## Craftsmen INSERT

```typescript
{
  slug:             slugify(title),                     // unique, auto-suffix ako konflikt
  business_name:    title,
  category_id:      categoryMap.get(categorySlug),
  address:          address,
  location:         `SRID=4326;POINT(${lng} ${lat})`,   // EWKT za PostGIS geography
  phone:            phone ?? null,
  website:          null,
  viber:            null,
  whatsapp:         null,
  email:            null,
  google_place_id:  place_id,
  status:           'pending',
  source:           'scraped',
}
```

---

## Slug generisanje

```
"Auto servis Petrović NS" → "auto-servis-petrovic-ns"
```

Algoritam:
1. Lowercase
2. Ručna zamena: `đ→d`
3. NFD normalizacija → ukloni combining karaktere (š→s, č→c, ć→c, ž→z)
4. Izbaci sve što nije `[a-z0-9\s-]`
5. Razmaci → `-`, kolapsiraj višestruke crtice

Conflict resolution: proveri u bazi, dodaj `-2`, `-3`... dok ne bude jedinstven.

---

## Error handling

| Scenario | Ponašanje |
|---|---|
| SerpApi greška (rate limit, network) | Log + nastavi sledeća kategorija |
| Rezultat van NS bounding box-a | Preskoči tiho |
| INSERT greška (sem conflict) | Log + nastavi |
| `on conflict (google_place_id) do nothing` | Duplikati se automatski preskaču |
| `phone` nedostaje | Upiši `null` |

---

## Zavisnosti

| Paket | Status | Svrha |
|---|---|---|
| `tsx` | Dodati kao devDependency | Pokretanje TypeScript skripti |
| `@supabase/supabase-js` | Već instaliran | Supabase client |
| `fetch` | Node 18+ built-in | HTTP pozivi ka SerpApi |

---

## Verifikacija

1. Skripta se pokreće bez grešaka: `npx tsx scripts/scrape.ts`
2. Summary pokazuje > 0 upisanih majstora
3. `/limar` stranica prikazuje kartice majstora
4. `/mapa` prikazuje markere na tačnim lokacijama u Novom Sadu
5. Duplo pokretanje skripte ne duplira podatke
