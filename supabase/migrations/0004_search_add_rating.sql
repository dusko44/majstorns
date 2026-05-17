CREATE OR REPLACE FUNCTION public.search_craftsmen(term text)
RETURNS TABLE(slug text, business_name text, category_name text, address text, phone text, lat double precision, lng double precision, rating numeric, review_count integer)
LANGUAGE sql STABLE AS $$
  SELECT slug, business_name, category_name, address, phone, lat, lng, rating, review_count
  FROM craftsmen_map_view
  WHERE
    unaccent(business_name) ILIKE '%' || unaccent(term) || '%'
    OR unaccent(category_name) ILIKE '%' || unaccent(term) || '%'
    OR unaccent(cyr_to_lat(business_name)) ILIKE '%' || unaccent(cyr_to_lat(term)) || '%'
  LIMIT 200;
$$;
