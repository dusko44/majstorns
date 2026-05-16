import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "Politika privatnosti sajta MajstorNS — kako prikupljamo, čuvamo i koristimo podatke.",
};

export default function PrivatnostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Politika privatnosti
      </h1>
      <p className="mt-3 text-sm text-zinc-500">Poslednja izmena: maj 2026.</p>

      <div className="mt-8 space-y-8 text-sm text-zinc-600">

        <section>
          <h2 className="text-base font-semibold text-zinc-900">1. Opšte informacije</h2>
          <p className="mt-2">
            MajstorNS (u daljem tekstu: „Sajt") poštuje privatnost svojih korisnika i zanatlija
            prikazanih u direktorijumu. Ova politika privatnosti objašnjava koje podatke prikupljamo,
            na koji način ih koristimo i kako ih štitimo, u skladu sa Zakonom o zaštiti podataka
            o ličnosti Republike Srbije (ZZPL).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">2. Podaci o posetiocima sajta</h2>
          <p className="mt-2">
            MajstorNS ne zahteva registraciju korisnika niti prikuplja lične podatke posetilaca
            putem obrazaca (osim u slučaju slanja upita putem kontakt stranice ili podnošenja
            zahteva za uklanjanje podataka). Sajt može prikupljati anonimne statističke podatke
            o posetu (broj poseta, pregledane stranice, vrsta uređaja i pretraživača) isključivo
            u svrhu poboljšanja korisničkog iskustva.
          </p>
          <p className="mt-2">
            Ovi statistički podaci ne sadrže informacije na osnovu kojih bi bilo moguće identifikovati
            pojedinačnog korisnika.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">3. Podaci prikupljeni putem kontakt forme</h2>
          <p className="mt-2">
            Ukoliko nam se obratite putem kontakt stranice, prikupljamo podatke koje sami unesete
            (ime, email adresa, sadržaj poruke). Ovi podaci koriste se isključivo za odgovor na
            vaš upit i ne prosleđuju se trećim licima.
          </p>
          <p className="mt-2">
            Poruke se čuvaju onoliko dugo koliko je potrebno za rešavanje vašeg zahteva, a najduže
            12 meseci.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">4. Podaci o zanatlijama</h2>
          <p className="mt-2">
            Podaci o zanatlijama prikazani na MajstorNS (naziv radionice, adresa, broj telefona,
            radno vreme, kategorija delatnosti) prikupljeni su iz javno dostupnih izvora, uključujući
            Google Maps i javne poslovne registre. Reč je o poslovnim podacima koji se odnose na
            obavljanje registrovane delatnosti, a ne o privatnim podacima fizičkih lica.
          </p>
          <p className="mt-2">
            Svaki zanatlija ima pravo da zatraži ispravku ili uklanjanje svojih podataka.
            Zahtev možete podneti putem stranice{" "}
            <a href="/opt-out" className="underline text-zinc-900">Zahtev za uklanjanje</a> ili
            slanjem poruke putem stranice{" "}
            <a href="/kontakt" className="underline text-zinc-900">Kontakt</a>. Zahtevi se
            obrađuju u roku od 7 radnih dana.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">5. Kolačići (cookies)</h2>
          <p className="mt-2">
            Sajt koristi isključivo funkcionalne kolačiće neophodne za rad (npr. čuvanje sesije
            pri prijavi). Ne koristimo kolačiće za praćenje korisnika, remarketing ni personalizovano
            oglašavanje.
          </p>
          <p className="mt-2">
            Kolačiće možete onemogućiti u podešavanjima vašeg pretraživača, ali to može uticati
            na funkcionalnost pojedinih delova sajta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">6. Deljenje podataka sa trećim licima</h2>
          <p className="mt-2">
            MajstorNS ne prodaje, ne iznajmljuje ni na drugi način ne deli lične podatke korisnika
            sa trećim licima, osim kada je to zakonski obavezno ili neophodno za pružanje usluge
            (npr. hosting provajder).
          </p>
          <p className="mt-2">
            Sajt koristi usluge trećih strana za hosting i infrastrukturu. Navedeni provajderi
            obrađuju podatke isključivo u naše ime i u skladu sa sopstvenim politikama privatnosti.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">7. Bezbednost podataka</h2>
          <p className="mt-2">
            Preduzimamo razumne tehničke i organizacione mere zaštite podataka od neovlašćenog
            pristupa, izmene ili uništenja. Komunikacija između korisnika i sajta zaštićena je
            SSL/TLS enkripcijom (HTTPS).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">8. Vaša prava</h2>
          <p className="mt-2">
            U skladu sa ZZPL, imate pravo na:
          </p>
          <ul className="mt-2 ml-4 space-y-1 list-disc list-outside">
            <li>pristup podacima koji se na vas odnose,</li>
            <li>ispravku netačnih podataka,</li>
            <li>brisanje podataka („pravo na zaborav"),</li>
            <li>prigovor na obradu podataka.</li>
          </ul>
          <p className="mt-2">
            Zahtev za ostvarivanje ovih prava možete podneti putem stranice{" "}
            <a href="/kontakt" className="underline text-zinc-900">Kontakt</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">9. Izmene politike privatnosti</h2>
          <p className="mt-2">
            Zadržavamo pravo izmene ove politike u bilo kom trenutku. Izmene stupaju na snagu
            objavljivanjem na ovoj stranici. Preporučujemo da periodično pregledate ovu stranicu.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">10. Kontakt</h2>
          <p className="mt-2">
            Za sva pitanja vezana za privatnost i obradu podataka možete nas kontaktirati putem
            stranice{" "}
            <a href="/kontakt" className="underline text-zinc-900">Kontakt</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
