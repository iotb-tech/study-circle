-- ============================================================
-- Study Circle — Initial Database Migration (FIXED)
-- ============================================================
-- Apply: Copy this entire file into Supabase SQL Editor → Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. Enable required extensions
-- ------------------------------------------------------------

-- For UUID generation (gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 2. PROFILES TABLE
-- ------------------------------------------------------------
-- Links to auth.users (managed by Supabase Auth)
-- Stores public application data about users

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Public user profiles linked to auth.users';

-- ------------------------------------------------------------
-- 3. POSTS TABLE
-- ------------------------------------------------------------

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  
  -- Full-text search vector (maintained by trigger, not generated column)
  search_vector tsvector
);

COMMENT ON TABLE public.posts IS 'Knowledge base posts with full-text search';
COMMENT ON COLUMN public.posts.search_vector IS 'tsvector maintained by trigger (title=A, body=B, tags=C)';

-- ------------------------------------------------------------
-- 3b. SEARCH VECTOR FUNCTION AND TRIGGER
-- ------------------------------------------------------------

-- Function: Compute the search vector from title, body, and tags
CREATE OR REPLACE FUNCTION public.posts_update_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.body, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$;

-- Trigger: Update search_vector before INSERT or UPDATE
CREATE TRIGGER posts_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.posts_update_search_vector();

COMMENT ON FUNCTION public.posts_update_search_vector() IS 'Computes weighted tsvector for full-text search on posts';

-- ------------------------------------------------------------
-- 4. COMMENTS TABLE
-- ------------------------------------------------------------

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

COMMENT ON TABLE public.comments IS 'Comments on knowledge base posts';

-- ------------------------------------------------------------
-- 5. VOTES TABLE
-- ------------------------------------------------------------

CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  value smallint NOT NULL DEFAULT 1 CHECK (value = 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- CRITICAL: Vote on post XOR comment — never both, never neither
  CONSTRAINT votes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (comment_id IS NOT NULL AND post_id IS NULL)
  )
);

COMMENT ON TABLE public.votes IS 'Upvotes for posts and comments (one per user per target)';
COMMENT ON COLUMN public.votes.value IS 'Vote value: 1 for upvote';

-- ------------------------------------------------------------
-- 6. INDEXES
-- ------------------------------------------------------------

-- Fast lookup: "all posts by user X"
CREATE INDEX posts_user_id_idx ON public.posts(user_id);

-- Sorting: "newest posts first"
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);

-- Full-text search index (CRITICAL for performance)
CREATE INDEX posts_search_idx ON public.posts USING GIN (search_vector);

-- Tag filtering with array operators (ANY, &&)
CREATE INDEX posts_tags_idx ON public.posts USING GIN (tags);

-- Fast lookup: "all comments for post X" (used on every post page)
CREATE INDEX comments_post_id_idx ON public.comments(post_id);

-- Fast lookup: "all comments by user X" (profile pages)
CREATE INDEX comments_user_id_idx ON public.comments(user_id);

-- Prevent duplicate post votes (one vote per user per post)
CREATE UNIQUE INDEX votes_user_post_unique ON public.votes(user_id, post_id) 
  WHERE post_id IS NOT NULL;

-- Prevent duplicate comment votes (one vote per user per comment)
CREATE UNIQUE INDEX votes_user_comment_unique ON public.votes(user_id, comment_id) 
  WHERE comment_id IS NOT NULL;

-- ------------------------------------------------------------
-- 7. AUTO-CREATE PROFILE ON SIGNUP
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 8. ENABLE ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 9. RLS POLICIES — PROFILES
-- ------------------------------------------------------------

-- Anyone can view all profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- 10. RLS POLICIES — POSTS
-- ------------------------------------------------------------

-- Anyone can view all posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

-- Authenticated users can create posts (as themselves)
CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 11. RLS POLICIES — COMMENTS
-- ------------------------------------------------------------

-- Anyone can view all comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

-- Authenticated users can create comments (as themselves)
CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete own comments OR post authors can moderate
CREATE POLICY "Users can delete own comments or post author can moderate" ON public.comments
  FOR DELETE USING (
    auth.uid() = user_id 
    OR 
    auth.uid() = (SELECT user_id FROM public.posts WHERE id = post_id)
  );

-- ------------------------------------------------------------
-- 12. RLS POLICIES — VOTES
-- ------------------------------------------------------------

-- Anyone can view votes (needed for vote counts)
CREATE POLICY "Votes are viewable by everyone" ON public.votes
  FOR SELECT USING (true);

-- Authenticated users can vote (as themselves)
CREATE POLICY "Authenticated users can create votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove their own votes (unvote)
CREATE POLICY "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- END OF MIGRATION
-- ============================================================