import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "limar", name: "Limar", plural: "Limari", iconKey: "limar", metaDescription: "Limarski radovi u Novom Sadu — krovovi, oluci, opšivke. Pronađi proverenog limara u svom kraju." },
  { slug: "stolar", name: "Stolar", plural: "Stolari", iconKey: "stolar", metaDescription: "Stolarske usluge u Novom Sadu — nameštaj po meri, vrata, prozori, kuhinje." },
  { slug: "vodoinstalater", name: "Vodoinstalater", plural: "Vodoinstalateri", iconKey: "vodoinstalater", metaDescription: "Vodoinstalateri u Novom Sadu — popravke, odgušenja, kupatila. Hitne intervencije." },
  { slug: "elektricar", name: "Električar", plural: "Električari", iconKey: "elektricar", metaDescription: "Električari u Novom Sadu — instalacije, kvarovi, rasveta, ormari." },
  { slug: "automehanicar", name: "Automehaničar", plural: "Automehaničari", iconKey: "automehanicar", metaDescription: "Automehaničari u Novom Sadu — servis, popravka motora, dijagnostika." },
  { slug: "moler", name: "Moler-farbar", plural: "Moleri", iconKey: "moler", metaDescription: "Moleri u Novom Sadu — krečenje, gletovanje, dekorativni radovi." },
  { slug: "klima-servis", name: "Servis klima uređaja", plural: "Servisi klima uređaja", iconKey: "klima", metaDescription: "Servis i ugradnja klima uređaja u Novom Sadu — punjenje gasa, čišćenje, popravke." },
  { slug: "bravar", name: "Bravar", plural: "Bravari", iconKey: "bravar", metaDescription: "Bravari u Novom Sadu — ograde, kapije, brave, hitno otvaranje vrata." },
  { slug: "keramicar", name: "Keramičar", plural: "Keramičari", iconKey: "keramicar", metaDescription: "Keramičari u Novom Sadu — postavljanje pločica, kupatila, terase." },
  { slug: "parketar", name: "Parketar", plural: "Parketari", iconKey: "parketar", metaDescription: "Parketari u Novom Sadu — postavljanje, hoblovanje, lakiranje parketa." },
  { slug: "tapetar", name: "Tapetar", plural: "Tapetari", iconKey: "tapetar", metaDescription: "Tapetari u Novom Sadu — presvlačenje nameštaja, tapaciranje, popravke." },
  { slug: "krovopokrivac", name: "Krovopokrivač", plural: "Krovopokrivači", iconKey: "krov", metaDescription: "Krovopokrivači u Novom Sadu — postavljanje crepa, lima, sanacija krovova." },
  { slug: "staklorezac", name: "Staklorezac", plural: "Staklorezci", iconKey: "staklorezac", metaDescription: "Staklorezci u Novom Sadu — staklo po meri, ogledala, ulasci, zamena stakla." },
  { slug: "roletar", name: "Roletar", plural: "Roletari", iconKey: "roletar", metaDescription: "Roletari u Novom Sadu — popravka i ugradnja roletni, komarnika, venecijanera." },
  { slug: "auto-elektricar", name: "Auto-električar", plural: "Auto-električari", iconKey: "auto-elektricar", metaDescription: "Auto-električari u Novom Sadu — dijagnostika, alternator, akumulator, instalacija." },
  { slug: "vulkanizer", name: "Vulkanizer", plural: "Vulkanizeri", iconKey: "vulkanizer", metaDescription: "Vulkanizeri u Novom Sadu — zamena guma, centriranje, balansiranje." },
  { slug: "servis-bele-tehnike", name: "Servis bele tehnike", plural: "Servisi bele tehnike", iconKey: "bela-tehnika", metaDescription: "Servis bele tehnike u Novom Sadu — veš mašine, frižideri, šporeti." },
  { slug: "gradjevinar", name: "Građevinski radovi", plural: "Građevinari", iconKey: "gradjevinar", metaDescription: "Građevinski radovi u Novom Sadu — adaptacije, zidanje, malterisanje, betoniranje." },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
