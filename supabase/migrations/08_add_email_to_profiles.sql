-- Add email column to profiles
-- This stores a copy of the user's email from auth.users
-- Used for admin panel display and user management

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN public.profiles.email IS 'User email copied from auth.users for admin display';

-- Update the trigger function to also insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;