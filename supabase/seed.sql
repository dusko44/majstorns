-- Seed: categories and neighborhoods.
-- Keep slugs in sync with lib/categories.ts and lib/neighborhoods.ts.

insert into public.categories (slug, name_sr, plural_sr, display_order, seo_meta_description) values
  ('limar', 'Limar', 'Limari', 1, 'Limarski radovi u Novom Sadu — krovovi, oluci, opšivke.'),
  ('stolar', 'Stolar', 'Stolari', 2, 'Stolarske usluge u Novom Sadu — nameštaj po meri, vrata, prozori, kuhinje.'),
  ('vodoinstalater', 'Vodoinstalater', 'Vodoinstalateri', 3, 'Vodoinstalateri u Novom Sadu — popravke, odgušenja, kupatila.'),
  ('elektricar', 'Električar', 'Električari', 4, 'Električari u Novom Sadu — instalacije, kvarovi, rasveta.'),
  ('automehanicar', 'Automehaničar', 'Automehaničari', 5, 'Automehaničari u Novom Sadu — servis, popravka motora, dijagnostika.'),
  ('moler', 'Moler-farbar', 'Moleri', 6, 'Moleri u Novom Sadu — krečenje, gletovanje, dekorativni radovi.'),
  ('klima-servis', 'Servis klima uređaja', 'Servisi klima uređaja', 7, 'Servis i ugradnja klima uređaja u Novom Sadu.'),
  ('bravar', 'Bravar', 'Bravari', 8, 'Bravari u Novom Sadu — ograde, kapije, brave, hitno otvaranje vrata.'),
  ('keramicar', 'Keramičar', 'Keramičari', 9, 'Keramičari u Novom Sadu — postavljanje pločica, kupatila, terase.'),
  ('parketar', 'Parketar', 'Parketari', 10, 'Parketari u Novom Sadu — postavljanje, hoblovanje, lakiranje parketa.'),
  ('tapetar', 'Tapetar', 'Tapetari', 11, 'Tapetari u Novom Sadu — presvlačenje nameštaja, tapaciranje.'),
  ('krovopokrivac', 'Krovopokrivač', 'Krovopokrivači', 12, 'Krovopokrivači u Novom Sadu — postavljanje crepa, lima, sanacija krovova.'),
  ('staklorezac', 'Staklorezac', 'Staklorezci', 13, 'Staklorezci u Novom Sadu — staklo po meri, ogledala, ulasci.'),
  ('roletar', 'Roletar', 'Roletari', 14, 'Roletari u Novom Sadu — popravka i ugradnja roletni, komarnika.'),
  ('auto-elektricar', 'Auto-električar', 'Auto-električari', 15, 'Auto-električari u Novom Sadu — dijagnostika, alternator, akumulator.'),
  ('vulkanizer', 'Vulkanizer', 'Vulkanizeri', 16, 'Vulkanizeri u Novom Sadu — zamena guma, centriranje, balansiranje.'),
  ('servis-bele-tehnike', 'Servis bele tehnike', 'Servisi bele tehnike', 17, 'Servis bele tehnike u Novom Sadu — veš mašine, frižideri, šporeti.'),
  ('gradjevinar', 'Građevinski radovi', 'Građevinari', 18, 'Građevinski radovi u Novom Sadu — adaptacije, zidanje, malterisanje.')
on conflict (slug) do nothing;

insert into public.neighborhoods (slug, name_sr, city, center_point) values
  ('centar', 'Centar', 'Novi Sad', st_point(19.8335, 45.2671)::geography),
  ('liman', 'Liman', 'Novi Sad', st_point(19.8408, 45.2453)::geography),
  ('detelinara', 'Detelinara', 'Novi Sad', st_point(19.8079, 45.2624)::geography),
  ('telep', 'Telep', 'Novi Sad', st_point(19.8169, 45.2374)::geography),
  ('novo-naselje', 'Novo naselje', 'Novi Sad', st_point(19.7902, 45.2616)::geography),
  ('podbara', 'Podbara', 'Novi Sad', st_point(19.8482, 45.2780)::geography),
  ('salajka', 'Salajka', 'Novi Sad', st_point(19.8528, 45.2722)::geography),
  ('klisa', 'Klisa', 'Novi Sad', st_point(19.8350, 45.2912)::geography),
  ('petrovaradin', 'Petrovaradin', 'Petrovaradin', st_point(19.8638, 45.2510)::geography),
  ('sremska-kamenica', 'Sremska Kamenica', 'Sremska Kamenica', st_point(19.8431, 45.2226)::geography),
  ('veternik', 'Veternik', 'Veternik', st_point(19.7625, 45.2487)::geography),
  ('futog', 'Futog', 'Futog', st_point(19.7106, 45.2447)::geography)
on conflict (slug) do nothing;
