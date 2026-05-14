import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uslovi korišćenja",
};

export default function UsloviPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Uslovi korišćenja
      </h1>

      <div className="mt-8 space-y-6 text-sm text-zinc-600">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            1. Opšte odredbe
          </h2>
          <p className="mt-2">
            Korišćenjem sajta MajstorNS prihvatate ove uslove. Sajt je
            informativnog karaktera i ne pruža usluge posredovanja niti
            garantuje kvalitet radova prikazanih zanatlija.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            2. Tačnost podataka
          </h2>
          <p className="mt-2">
            Podaci o zanatlijama prikupljeni su iz javno dostupnih izvora.
            Trudimo se da informacije budu tačne i ažurne, ali ne možemo
            garantovati njihovu potpunu ispravnost. Ako primetite grešku,
            molimo vas da nas kontaktirate.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            3. Pravo na uklanjanje
          </h2>
          <p className="mt-2">
            Svaki zanatlija ima pravo da zatraži uklanjanje svojih podataka
            sa sajta putem stranice za odjavu. Zahtevi se obrađuju u roku
            od 7 radnih dana.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            4. Odricanje od odgovornosti
          </h2>
          <p className="mt-2">
            MajstorNS nije odgovoran za kvalitet usluga prikazanih zanatlija
            niti za bilo kakvu štetu nastalu kao posledica kontakta ili
            angažovanja zanatlija pronađenog putem ovog sajta.
          </p>
        </section>
      </div>
    </div>
  );
}
