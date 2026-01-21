-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;

-- Create a more restrictive INSERT policy - only authenticated users can insert
-- and they must provide their own user_id (or null for anonymous events)
CREATE POLICY "Authenticated users can insert analytics" 
ON public.analytics_events 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Users can only insert events with their own user_id or null (for anonymous tracking)
  user_id IS NULL OR user_id = auth.uid()
);

-- Add validation trigger to enforce event_type is not empty and limit event_data size
CREATE OR REPLACE FUNCTION public.validate_analytics_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate event_type is not empty
  IF NEW.event_type IS NULL OR length(trim(NEW.event_type)) = 0 THEN
    RAISE EXCEPTION 'event_type cannot be empty';
  END IF;
  
  -- Limit event_type length to prevent abuse
  IF length(NEW.event_type) > 100 THEN
    RAISE EXCEPTION 'event_type too long (max 100 characters)';
  END IF;
  
  -- Limit event_data JSON size to prevent storage abuse (max 10KB)
  IF octet_length(NEW.event_data::text) > 10240 THEN
    RAISE EXCEPTION 'event_data too large (max 10KB)';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_analytics_event_trigger ON public.analytics_events;
CREATE TRIGGER validate_analytics_event_trigger
BEFORE INSERT ON public.analytics_events
FOR EACH ROW
EXECUTE FUNCTION public.validate_analytics_event();