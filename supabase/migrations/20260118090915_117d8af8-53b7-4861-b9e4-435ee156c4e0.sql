-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.extract_section_text(content_json jsonb)
RETURNS text AS $$
DECLARE
  result text := '';
  block jsonb;
BEGIN
  FOR block IN SELECT * FROM jsonb_array_elements(content_json)
  LOOP
    IF block->>'type' = 'paragraph' THEN
      result := result || ' ' || COALESCE(block->>'text', '');
    ELSIF block->>'type' = 'heading' THEN
      result := result || ' ' || COALESCE(block->>'text', '');
    ELSIF block->>'type' = 'callout' THEN
      result := result || ' ' || COALESCE(block->>'title', '') || ' ' || COALESCE(block->>'text', '');
    ELSIF block->>'type' = 'list' THEN
      result := result || ' ' || COALESCE(array_to_string(ARRAY(SELECT jsonb_array_elements_text(block->'items')), ' '), '');
    ELSIF block->>'type' = 'figure' THEN
      result := result || ' ' || COALESCE(block->>'caption', '');
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.search_sections(search_query text)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;