type CraftsmanRow = {
  id: string;
  slug: string;
  business_name: string;
  address: string;
  phone: string | null;
  website: string | null;
  viber: string | null;
  whatsapp: string | null;
  email: string | null;
  description: string | null;
  status: string;
};

export function CraftsmanCard({ craftsman }: { craftsman: CraftsmanRow }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900">
          {craftsman.business_name}
        </h3>
        {craftsman.status === "paid" && (
          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            Istaknuto
          </span>
        )}
      </div>

      {craftsman.description && (
        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
          {craftsman.description}
        </p>
      )}

      <p className="mt-2 text-xs text-zinc-500">{craftsman.address}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {craftsman.phone && (
          <a
            href={`tel:${craftsman.phone}`}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Pozovi
          </a>
        )}
        {craftsman.viber && (
          <a
            href={`viber://chat?number=${craftsman.viber.replace(/\D/g, "")}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300"
          >
            Viber
          </a>
        )}
        {craftsman.whatsapp && (
          <a
            href={`https://wa.me/${craftsman.whatsapp.replace(/\D/g, "")}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        )}
        {craftsman.website && (
          <a
            href={craftsman.website}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sajt
          </a>
        )}
      </div>
    </div>
  );
}
