import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti",
};

export default function PrivatnostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Politika privatnosti
      </h1>

      <div className="mt-8 space-y-6 text-sm text-zinc-600">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            Podaci koji se prikupljaju
          </h2>
          <p className="mt-2">
            MajstorNS ne zahteva registraciju niti prikuplja lične podatke
            posetilaca. Koristimo anonimnu analitiku poseta isključivo radi
            poboljšanja sajta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            Podaci o zanatlijama
          </h2>
          <p className="mt-2">
            Podaci o zanatlijama (ime, adresa, telefon) preuzeti su iz javno
            dostupnih izvora. Ukoliko ste zanatlija i ne želite da vaši
            podaci budu prikazani, možete podneti zahtev za uklanjanje.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">Kolačići</h2>
          <p className="mt-2">
            Sajt ne koristi kolačiće za praćenje. Mogu se koristiti
            funkcionalni kolačići neophodnog karaktera za rad sajta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">Kontakt</h2>
          <p className="mt-2">
            Za sva pitanja vezana za privatnost pišite nam na adresu
            navedenu na stranici Kontakt.
          </p>
        </section>
      </div>
    </div>
  );
}
