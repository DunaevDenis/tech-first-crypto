-- Create function to extract text from content_json for full-text search
CREATE OR REPLACE FUNCTION extract_section_text(content_json jsonb)
RETURNS text AS $$
DECLARE
  result text := '';
  block jsonb;
BEGIN
  FOR block IN SELECT * FROM jsonb_array_elements(content_json)
  LOOP
    -- Extract text from paragraphs
    IF block->>'type' = 'paragraph' THEN
      result := result || ' ' || COALESCE(block->>'text', '');
    -- Extract text from headings
    ELSIF block->>'type' = 'heading' THEN
      result := result || ' ' || COALESCE(block->>'text', '');
    -- Extract text from callouts
    ELSIF block->>'type' = 'callout' THEN
      result := result || ' ' || COALESCE(block->>'title', '') || ' ' || COALESCE(block->>'text', '');
    -- Extract items from lists
    ELSIF block->>'type' = 'list' THEN
      result := result || ' ' || COALESCE(array_to_string(ARRAY(SELECT jsonb_array_elements_text(block->'items')), ' '), '');
    -- Extract caption from figures
    ELSIF block->>'type' = 'figure' THEN
      result := result || ' ' || COALESCE(block->>'caption', '');
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create generated column for searchable text
ALTER TABLE public.sections 
ADD COLUMN IF NOT EXISTS searchable_text text 
GENERATED ALWAYS AS (title || ' ' || extract_section_text(content_json)) STORED;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_sections_fts 
ON public.sections 
USING GIN (to_tsvector('russian', COALESCE(searchable_text, '')));

-- Create search function
CREATE OR REPLACE FUNCTION search_sections(search_query text)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  chapter_id uuid,
  snippet text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.slug,
    s.chapter_id,
    ts_headline('russian', s.searchable_text, plainto_tsquery('russian', search_query), 
      'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>') as snippet,
    ts_rank(to_tsvector('russian', COALESCE(s.searchable_text, '')), plainto_tsquery('russian', search_query)) as rank
  FROM public.sections s
  WHERE to_tsvector('russian', COALESCE(s.searchable_text, '')) @@ plainto_tsquery('russian', search_query)
  ORDER BY rank DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;