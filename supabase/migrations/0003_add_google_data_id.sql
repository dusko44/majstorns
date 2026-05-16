ALTER TABLE public.craftsmen ADD COLUMN IF NOT EXISTS google_data_id text;
CREATE UNIQUE INDEX IF NOT EXISTS craftsmen_google_data_id_uniq
  ON public.craftsmen(google_data_id) WHERE google_data_id IS NOT NULL;
