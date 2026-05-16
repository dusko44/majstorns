-- Ćirilica → latinica transliteracija (srpski)
CREATE OR REPLACE FUNCTION public.cyr_to_lat(t text) RETURNS text
LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
  -- Digraphi prvo (dvoslovne kombinacije)
  t := replace(t, 'Љ', 'Lj');
  t := replace(t, 'Њ', 'Nj');
  t := replace(t, 'Џ', 'Dz');
  t := replace(t, 'љ', 'lj');
  t := replace(t, 'њ', 'nj');
  t := replace(t, 'џ', 'dz');
  -- Jednoslovne zamene
  t := translate(t,
    'АБВГДЂЕЖЗИЈКЛМНОПРСТЋУФХЦЧШабвгдђежзијклмнопрстћуфхцчш',
    'ABVGDĐEŽZIJKLMNOPRSTĆUFHCČŠabvgdđežzijklmnoprstćufhcčš'
  );
  RETURN t;
END;
$$;

-- Ažurirana pretraga: latinica pronalazi ćirilicu i obrnuto
CREATE OR REPLACE FUNCTION public.search_craftsmen(term text)
RETURNS TABLE(slug text, business_name text, category_name text, address text, phone text, lat double precision, lng double precision)
LANGUAGE sql STABLE AS $$
  SELECT slug, business_name, category_name, address, phone, lat, lng
  FROM craftsmen_map_view
  WHERE
    unaccent(business_name) ILIKE '%' || unaccent(term) || '%'
    OR unaccent(category_name) ILIKE '%' || unaccent(term) || '%'
    OR unaccent(cyr_to_lat(business_name)) ILIKE '%' || unaccent(cyr_to_lat(term)) || '%'
  LIMIT 200;
$$;
