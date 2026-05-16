import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uslovi korišćenja",
  description: "Uslovi korišćenja sajta MajstorNS — direktorijuma zanatlija u Novom Sadu.",
  alternates: { canonical: "/uslovi" },
};

export default function UsloviPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Uslovi korišćenja
      </h1>
      <p className="mt-3 text-sm text-zinc-500">Poslednja izmena: maj 2026.</p>

      <div className="mt-8 space-y-8 text-sm text-zinc-600">

        <section>
          <h2 className="text-base font-semibold text-zinc-900">1. O sajtu</h2>
          <p className="mt-2">
            MajstorNS je online direktorijum zanatlija i servisnih radnji na području Novog Sada.
            Sajt je isključivo informativnog karaktera — ne posreduje između korisnika i zanatlija,
            ne naplaćuje provizije i ne garantuje kvalitet prikazanih usluga. Kontakt između
            korisnika i zanatlije odvija se direktno, bez posredništva sajta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">2. Korišćenje sajta</h2>
          <p className="mt-2">
            Korišćenjem sajta MajstorNS prihvatate ove uslove u celosti. Sajt možete koristiti
            isključivo u zakonite svrhe i na način koji ne narušava prava trećih lica. Zabranjeno
            je automatsko preuzimanje podataka (scraping) bez prethodnog pisanog odobrenja.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">3. Tačnost podataka</h2>
          <p className="mt-2">
            Podaci o zanatlijama (naziv radionice, adresa, broj telefona, radno vreme) prikupljeni
            su iz javno dostupnih izvora, uključujući Google Maps i javne poslovne registre.
            Trudimo se da informacije budu tačne i ažurne, ali ne možemo garantovati njihovu
            potpunu ispravnost u svakom trenutku. Podaci se redovno proveravaju i ažuriraju.
          </p>
          <p className="mt-2">
            Ako primetite grešku u podacima, molimo vas da nas obavestite putem stranice{" "}
            <a href="/kontakt" className="underline text-zinc-900">Kontakt</a> — ispravićemo
            je u najkraćem mogućem roku.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">4. Prava zanatlija</h2>
          <p className="mt-2">
            Svaki zanatlija čiji su podaci prikazani na sajtu ima pravo da zatraži uklanjanje
            ili ispravku svojih podataka. Zahtev za uklanjanje možete podneti putem stranice{" "}
            <a href="/opt-out" className="underline text-zinc-900">Zahtev za uklanjanje</a> ili
            slanjem poruke na našu email adresu.
          </p>
          <p className="mt-2">
            Zahtevi se obrađuju u roku od 7 radnih dana. Podaci se sklanjaju sa javnog prikaza
            odmah po obradi zahteva, ali mogu biti zadržani interno radi evidencije u skladu
            sa zakonskim obavezama.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">5. Plaćene usluge</h2>
          <p className="mt-2">
            MajstorNS nudi mogućnost istaknute prezentacije za zanatlije koji žele veću vidljivost.
            Plaćena istaknuta prezentacija podrazumeva godišnju pretplatu čija cena i uslovi
            bivaju dogovoreni direktno sa zanatlijom. Detalji o cenama i uslovima dostupni su
            na stranici{" "}
            <a href="/kontakt" className="underline text-zinc-900">Kontakt</a>.
          </p>
          <p className="mt-2">
            Zanatlije koje ne obnove godišnju pretplatu nastavljaju da budu prikazane u
            direktorijumu, ali bez oznake istaknute prezentacije.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">6. Odricanje od odgovornosti</h2>
          <p className="mt-2">
            MajstorNS ne snosi odgovornost za kvalitet usluga, tačnost ponuda, poštovanje
            rokova ni bilo kakvu drugu obavezu zanatlija prikazanih na sajtu. Svaki dogovor
            između korisnika i zanatlije isključiva je odgovornost obe strane.
          </p>
          <p className="mt-2">
            MajstorNS ne snosi odgovornost za eventualnu nedostupnost sajta, gubitak podataka
            ni štetu nastalu usled tehničkih problema van naše kontrole.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">7. Intelektualna svojina</h2>
          <p className="mt-2">
            Dizajn, tekstovi i softverski kod sajta MajstorNS zaštićeni su autorskim pravom.
            Zabranjena je reprodukcija, distribucija ili korišćenje sadržaja bez pisanog
            odobrenja. Podaci o zanatlijama preuzeti su iz javnih izvora i nisu predmet
            autorskog prava.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">8. Izmene uslova</h2>
          <p className="mt-2">
            Zadržavamo pravo izmene ovih uslova u bilo kom trenutku. Izmene stupaju na snagu
            objavljivanjem na ovoj stranici. Nastavak korišćenja sajta nakon izmena smatra
            se prihvatanjem novih uslova.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">9. Merodavno pravo</h2>
          <p className="mt-2">
            Na ove uslove primenjuje se pravo Republike Srbije. Za sve sporove nadležan je
            sud u Novom Sadu.
          </p>
        </section>

      </div>
    </div>
  );
}
