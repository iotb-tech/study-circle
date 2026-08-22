-- Add suspended field to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspended boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.suspended IS 'Whether the user account is suspended';