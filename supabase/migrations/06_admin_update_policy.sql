-- Allow admins to update any user's profile (for role management)
-- This is required for the admin panel to change user roles

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON POLICY "Admins can update any profile" ON public.profiles IS
  'Allows admin users to update any profile, including role changes.';