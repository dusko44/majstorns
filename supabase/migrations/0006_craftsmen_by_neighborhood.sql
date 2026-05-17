CREATE OR REPLACE FUNCTION public.craftsmen_by_neighborhood(
  p_category_slug text,
  p_center_lat double precision,
  p_center_lng double precision,
  p_radius_km double precision
)
RETURNS TABLE(
  id uuid,
  slug text,
  business_name text,
  address text,
  phone text,
  lat double precision,
  lng double precision,
  category_name text,
  rating numeric,
  review_count integer
)
LANGUAGE sql STABLE AS $$
  SELECT
    c.id,
    c.slug,
    c.business_name,
    c.address,
    c.phone,
    ST_Y(c.location::geometry) AS lat,
    ST_X(c.location::geometry) AS lng,
    cat.name_sr AS category_name,
    c.rating,
    c.review_count
  FROM craftsmen c
  JOIN categories cat ON c.category_id = cat.id
  WHERE cat.slug = p_category_slug
    AND c.status IN ('pending', 'contacted', 'paid')
    AND c.location IS NOT NULL
    AND ST_DWithin(
      c.location,
      ST_MakePoint(p_center_lng, p_center_lat)::geography,
      p_radius_km * 1000
    );
$$;
