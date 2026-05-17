CREATE OR REPLACE VIEW public.craftsmen_map_view AS
  SELECT
    c.id,
    c.slug,
    c.business_name,
    c.address,
    c.phone,
    c.status,
    c.working_hours,
    c.website,
    c.viber,
    c.whatsapp,
    c.email,
    c.rating,
    c.review_count,
    ST_Y(c.location::geometry) AS lat,
    ST_X(c.location::geometry) AS lng,
    cat.slug AS category_slug,
    cat.name_sr AS category_name
  FROM craftsmen c
  JOIN categories cat ON c.category_id = cat.id;
