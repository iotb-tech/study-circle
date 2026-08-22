-- ============================================================
-- Study Circle — User Roles, Bio, and Notifications
-- ============================================================
-- This migration adds:
-- 1. Role field (fellow, mentor, admin) to profiles
-- 2. Bio field to profiles
-- 3. Notifications table for user notifications
-- ============================================================

-- ------------------------------------------------------------
-- 1. ADD ROLE TO PROFILES
-- ------------------------------------------------------------

-- Add role column with three possible values
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'fellow' 
CHECK (role IN ('fellow', 'mentor', 'admin'));

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.role IS 'User role: fellow (default), mentor, or admin';

-- ------------------------------------------------------------
-- 2. ADD BIO TO PROFILES
-- ------------------------------------------------------------

-- Add bio column (nullable, users can add later)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.bio IS 'User bio/description shown on profile page';

-- ------------------------------------------------------------
-- 3. CREATE NOTIFICATIONS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('role_request', 'role_approved', 'comment', 'vote', 'mention')),
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment explaining the table
COMMENT ON TABLE public.notifications IS 'User notifications for role requests, comments, votes, and mentions';

-- ------------------------------------------------------------
-- 4. ENABLE RLS ON NOTIFICATIONS
-- ------------------------------------------------------------

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 5. RLS POLICIES FOR NOTIFICATIONS
-- ------------------------------------------------------------

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notifications (via trigger or admin)
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. INDEX FOR FASTER NOTIFICATION QUERIES
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- ------------------------------------------------------------
-- END OF MIGRATION
-- ------------------------------------------------------------