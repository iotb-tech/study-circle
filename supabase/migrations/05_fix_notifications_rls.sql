-- Fix notifications RLS to allow users to send notifications to other users
-- This is needed for role requests (fellow sends notification to admin)

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

-- Create new insert policy that allows authenticated users to insert for any user
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add comment explaining the policy
COMMENT ON POLICY "Authenticated users can create notifications" ON public.notifications IS 
  'Allows authenticated users to create notifications for any user. Used for role requests from fellows to admins.';