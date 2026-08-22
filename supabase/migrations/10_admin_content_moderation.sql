-- Allow admins to delete any post
CREATE POLICY "Admins can delete any post" ON public.posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete any comment
CREATE POLICY "Admins can delete any comment" ON public.comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON POLICY "Admins can delete any post" ON public.posts IS
  'Allows admin users to delete any post for moderation purposes.';

COMMENT ON POLICY "Admins can delete any comment" ON public.comments IS
  'Allows admin users to delete any comment for moderation purposes.';