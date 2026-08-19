-- Function to delete a user from auth.users
-- This cascades to profiles and all related data
-- SECURITY DEFINER allows this to run with elevated privileges

CREATE OR REPLACE FUNCTION public.delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

COMMENT ON FUNCTION public.delete_user(uuid) IS 'Deletes a user from auth.users (cascades to profiles)';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user(uuid) TO authenticated;