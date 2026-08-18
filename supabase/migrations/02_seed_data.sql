-- ============================================================
-- Study Circle — Seed Data for Development
-- ============================================================
-- ⚠️  IMPORTANT: READ THIS BEFORE RUNNING  ⚠️
-- ============================================================
--
-- This file has been updated with the three test-user UUIDs provided for this setup.
-- You can run it after confirming the three users exist in Supabase.
--
-- HOW TO USE THIS FILE:
--
-- STEP 1: Create 3 test users via your app's signup page
--   User 1: your-email-1@test.com  (will be "MOTUNRAYO")
--   User 2: your-email-2@test.com  (will be "TEMITOPE")
--   User 3: your-email-3@test.com  (will be "mahmud")
--
-- STEP 2: Get their UUIDs
--   Go to Supabase Dashboard → Authentication → Users
--   Copy each user's UUID (looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
--
-- STEP 3: The IDs below have already been replaced with your three UUIDs.
--
-- STEP 4: Display names are kept as MOTUNRAYO, TEMITOPE, and mahmud.
--
-- ============================================================
-- INITIAL TEST USERS (FOR REFERENCE ONLY)
-- ============================================================
-- User 1: ibrahim@test.com    → b5cb315e-d211-44a1-a2c2-ed58a57afdfd → "Ibrahim Ibrahim"
-- User 2: monsurah@test.com   → 3cb164a0-fb8c-4205-9265-372e91a29ee0 → "Mahmud Monsurah"
-- User 3: muhammad@test.com   → 1dc8ef44-bf18-4442-9f06-e34b8f554618 → "Attah Muhammad Jamiu"
--
-- REPLACE ALL INSTANCES OF THESE IDs WITH YOUR OWN TEST USERS' IDs
-- ============================================================

-- ------------------------------------------------------------
-- 1. UPDATE PROFILE DISPLAY NAMES
-- ------------------------------------------------------------
-- REPLACE THESE IDs AND NAMES WITH YOUR OWN

UPDATE public.profiles 
SET display_name = 'motunraayo' 
WHERE id = '387672c5-6106-400f-9473-dfcdd7d29eae';  -- ← REPLACE 387672c5-6106-400f-9473-dfcdd7d29eae with your first user's UUID

UPDATE public.profiles 
SET display_name = 'temitope' 
WHERE id = '91513065-581f-408c-a598-1af4dba32c8b';  -- ← REPLACE 91513065-581f-408c-a598-1af4dba32c8b with your second user's UUID

UPDATE public.profiles 
SET display_name = 'mahmud' 
WHERE id = 'b53fd188-8a33-4fee-a498-367d097c3dab';  -- ← REPLACE b53fd188-8a33-4fee-a498-367d097c3dab with your third user's UUID

-- Verify profiles updated (uncomment to check)
-- SELECT id, display_name FROM public.profiles;

-- ------------------------------------------------------------
-- 2. CREATE TEST POSTS
-- ------------------------------------------------------------
-- REPLACE ALL 387672c5-6106-400f-9473-dfcdd7d29eae, 91513065-581f-408c-a598-1af4dba32c8b, b53fd188-8a33-4fee-a498-367d097c3dab with your actual UUIDs

INSERT INTO public.posts (id, user_id, title, body, tags) VALUES
(
  -- Post 1: MOTUNRAYO asks about React hooks
  'a1111111-1111-1111-1111-111111111111',
  '387672c5-6106-400f-9473-dfcdd7d29eae',  -- ← REPLACE with your first user's UUID
  'How do I use useEffect with async functions?',
  E'I''m trying to fetch data from an API inside useEffect, but I keep getting warnings about cleanup functions. Here''s my code:\n\n```jsx\nuseEffect(() => {\n  async function fetchData() {\n    const response = await fetch(''/api/data'');\n    const result = await response.json();\n    setData(result);\n  }\n  fetchData();\n}, []);\n```\n\nThe linter says I need to add fetchData to the dependency array, but if I do that, it causes an infinite loop. What''s the correct pattern for async operations in useEffect?',
  ARRAY['react', 'hooks', 'useeffect', 'async', 'fetch']
),
(
  -- Post 2: TEMITOPE asks about JavaScript fundamentals
  'a2222222-2222-2222-2222-222222222222',
  '91513065-581f-408c-a598-1af4dba32c8b',  -- ← REPLACE with your second user's UUID
  'What is the actual difference between let and const in JavaScript?',
  E'I understand that var is function-scoped and shouldn''t be used much anymore. But I''m confused about when to use let versus const. I''ve heard people say "always use const unless you need to reassign" but I see a lot of code using let everywhere.\n\nAlso, I learned that const doesn''t make objects immutable — you can still push to an array declared with const. So what exactly does const prevent? When should I actually use let?',
  ARRAY['javascript', 'variables', 'let', 'const', 'fundamentals']
),
(
  -- Post 3: mahmud asks about CSS layout
  'a3333333-3333-3333-3333-333333333333',
  'b53fd188-8a33-4fee-a498-367d097c3dab',  -- ← REPLACE with your third user's UUID
  'CSS Grid vs Flexbox — when should I use which one?',
  E'I''m building a dashboard layout and I''m not sure whether to use Grid or Flexbox for different sections. I know the basic rule: Flexbox for one-dimensional layouts and Grid for two-dimensional. But in practice, most layouts I see use both.\n\nFor example:\n- A navbar: obviously flexbox\n- A card grid: obviously CSS Grid\n- But what about a form? Or a page with a sidebar? What are your practical rules of thumb?',
  ARRAY['css', 'layout', 'grid', 'flexbox', 'design']
),
(
  -- Post 4: MOTUNRAYO asks about React rendering
  'a4444444-4444-4444-4444-444444444444',
  '387672c5-6106-400f-9473-dfcdd7d29eae',  -- ← REPLACE with your first user's UUID
  'Why is my React component rendering twice in development?',
  E'I noticed that my components are rendering twice on every state update. I added console.log statements and I can see the render function being called two times for a single setState call.\n\nI read somewhere that this is related to React StrictMode in development, but I want to understand:\n1. Why does StrictMode do this?\n2. Is it actually rendering twice or just simulating it?\n3. Should I be worried about performance in production?\n4. How do I properly debug when renders are doubled?',
  ARRAY['react', 'rendering', 'strict-mode', 'performance', 'debugging']
),
(
  -- Post 5: TEMITOPE asks about closures
  'a5555555-5555-5555-5555-555555555555',
  '91513065-581f-408c-a598-1af4dba32c8b',  -- ← REPLACE with your second user's UUID
  'Can someone explain JavaScript closures with a practical example?',
  E'I''ve read the MDN definition: "A closure is the combination of a function bundled together with references to its surrounding state." I understand the textbook example with nested functions, but I''m struggling to understand when and why you''d actually use closures in real code.\n\nI see closures mentioned in relation to event handlers, callbacks, and useEffect in React. Could someone show a practical, real-world example where a closure is the right solution?',
  ARRAY['javascript', 'closures', 'scope', 'fundamentals']
),
(
  -- Post 6: mahmud asks about Git workflow
  'a6666666-6666-6666-6666-666666666666',
  'b53fd188-8a33-4fee-a498-367d097c3dab',  -- ← REPLACE with your third user's UUID
  'What is the correct Git workflow for a team project?',
  E'Our team is starting our first collaborative project and we''re confused about the right Git workflow. We''ve been working directly on main and we keep running into merge conflicts.\n\nI''ve read about feature branches, pull requests, and code reviews. For a small team of 4 people working on a 2-week project, what''s the simplest workflow that prevents us from stepping on each other''s toes? And what do we do when merge conflicts happen?',
  ARRAY['git', 'workflow', 'team', 'branches', 'collaboration']
);

-- ------------------------------------------------------------
-- 3. CREATE TEST COMMENTS
-- ------------------------------------------------------------
-- REPLACE ALL 387672c5-6106-400f-9473-dfcdd7d29eae, 91513065-581f-408c-a598-1af4dba32c8b, b53fd188-8a33-4fee-a498-367d097c3dab with your actual UUIDs

INSERT INTO public.comments (id, post_id, user_id, body) VALUES
(
  -- TEMITOPE answers MOTUNRAYO's useEffect question
  'b1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '91513065-581f-408c-a598-1af4dba32c8b',  -- ← REPLACE with your second user's UUID
  E'Great question! You need to handle cleanup properly. The issue is that if the component unmounts before the fetch completes, you''ll get a warning. Here''s the correct pattern:\n\n```jsx\nuseEffect(() => {\n  let cancelled = false;\n  \n  async function fetchData() {\n    const response = await fetch(''/api/data'');\n    const result = await response.json();\n    if (!cancelled) setData(result);\n  }\n  \n  fetchData();\n  return () => { cancelled = true; };\n}, []);\n```\n\nThe cleanup function sets a flag that prevents setting state after unmounting.'
),
(
  -- mahmud also answers the useEffect question
  'b2222222-2222-2222-2222-222222222222',
  'a1111111-1111-1111-1111-111111111111',
  'b53fd188-8a33-4fee-a498-367d097c3dab',  -- ← REPLACE with your third user's UUID
  E'Adding to what TEMITOPE said — in React 18+, you can also use AbortController:\n\n```jsx\nuseEffect(() => {\n  const controller = new AbortController();\n  \n  async function fetchData() {\n    try {\n      const response = await fetch(''/api/data'', {\n        signal: controller.signal\n      });\n      const result = await response.json();\n      setData(result);\n    } catch (error) {\n      if (error.name !== ''AbortError'') console.error(error);\n    }\n  }\n  \n  fetchData();\n  return () => controller.abort();\n}, []);\n```\n\nThis is cleaner and handles network errors better.'
),
(
  -- MOTUNRAYO answers TEMITOPE's let/const question
  'b3333333-3333-3333-3333-333333333333',
  'a2222222-2222-2222-2222-222222222222',
  '387672c5-6106-400f-9473-dfcdd7d29eae',  -- ← REPLACE with your first user's UUID
  E'The rule I follow: default to const. Only use let when you KNOW the variable will be reassigned. This makes your code more predictable — when I see `let`, I immediately know "this variable changes later."\n\nAnd yes, you''re right about objects: const prevents reassignment of the variable itself, but doesn''t make the value immutable. `const arr = []; arr.push(1)` works fine, but `arr = [1]` would throw an error.'
),
(
  -- TEMITOPE answers mahmud's CSS question
  'b4444444-4444-4444-4444-444444444444',
  'a3333333-3333-3333-3333-333333333333',
  '91513065-581f-408c-a598-1af4dba32c8b',  -- ← REPLACE with your second user's UUID
  E'My rule of thumb:\n- If you''re arranging items in a single row or column → Flexbox\n- If you''re defining a 2D layout (rows AND columns) → Grid\n- Forms are usually flexbox (single column, stack vertically)\n- Page layout with sidebar → CSS Grid is cleaner\n\nBut honestly, you can achieve most layouts with either. Pick the one that requires less code for your specific case.'
),
(
  -- MOTUNRAYO also answers the CSS question
  'b5555555-5555-5555-5555-555555555555',
  'a3333333-3333-3333-3333-333333333333',
  '387672c5-6106-400f-9473-dfcdd7d29eae',  -- ← REPLACE with your first user's UUID
  E'For the specific case of a page with a sidebar: use CSS Grid. You can do `grid-template-columns: 250px 1fr` and it just works. With flexbox you''d need to set widths and worry about wrapping. Grid is more explicit about the layout structure.'
),
(
  -- mahmud answers TEMITOPE's closures question
  'b6666666-6666-6666-6666-666666666666',
  'a5555555-5555-5555-5555-555555555555',
  'b53fd188-8a33-4fee-a498-367d097c3dab',  -- ← REPLACE with your third user's UUID
  E'A practical example I use all the time: creating a counter function.\n\n```javascript\nfunction createCounter(start = 0) {\n  let count = start;\n  \n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter(10);\ncounter.increment(); // 11\ncounter.increment(); // 12\ncounter.getCount();  // 12\n```\n\nThe inner functions "close over" the `count` variable. No other code can access or modify `count` except through these methods. This is data privacy without classes!'
);

-- ------------------------------------------------------------
-- 4. CREATE TEST VOTES
-- ------------------------------------------------------------
-- REPLACE ALL 387672c5-6106-400f-9473-dfcdd7d29eae, 91513065-581f-408c-a598-1af4dba32c8b, b53fd188-8a33-4fee-a498-367d097c3dab with your actual UUIDs

-- Upvotes on posts
INSERT INTO public.votes (user_id, post_id, value) VALUES
('91513065-581f-408c-a598-1af4dba32c8b', 'a1111111-1111-1111-1111-111111111111', 1),  -- TEMITOPE upvotes MOTUNRAYO's useEffect post
('b53fd188-8a33-4fee-a498-367d097c3dab', 'a1111111-1111-1111-1111-111111111111', 1),  -- mahmud upvotes MOTUNRAYO's useEffect post
('387672c5-6106-400f-9473-dfcdd7d29eae', 'a2222222-2222-2222-2222-222222222222', 1),  -- MOTUNRAYO upvotes TEMITOPE's let/const post
('b53fd188-8a33-4fee-a498-367d097c3dab', 'a2222222-2222-2222-2222-222222222222', 1),  -- mahmud upvotes TEMITOPE's let/const post
('387672c5-6106-400f-9473-dfcdd7d29eae', 'a5555555-5555-5555-5555-555555555555', 1),  -- MOTUNRAYO upvotes TEMITOPE's closures post
('91513065-581f-408c-a598-1af4dba32c8b', 'a6666666-6666-6666-6666-666666666666', 1);  -- TEMITOPE upvotes mahmud's Git post

-- Upvotes on comments
INSERT INTO public.votes (user_id, comment_id, value) VALUES
('387672c5-6106-400f-9473-dfcdd7d29eae', 'b1111111-1111-1111-1111-111111111111', 1),  -- MOTUNRAYO upvotes TEMITOPE's answer on their post
('91513065-581f-408c-a598-1af4dba32c8b', 'b6666666-6666-6666-6666-666666666666', 1),  -- TEMITOPE upvotes mahmud's closures explanation
('b53fd188-8a33-4fee-a498-367d097c3dab', 'b3333333-3333-3333-3333-333333333333', 1),  -- mahmud upvotes MOTUNRAYO's let/const answer
('387672c5-6106-400f-9473-dfcdd7d29eae', 'b4444444-4444-4444-4444-444444444444', 1);  -- MOTUNRAYO upvotes TEMITOPE's CSS answer

-- ============================================================
-- VERIFICATION QUERIES (Run these to confirm data is correct)
-- ============================================================

-- Count all records
-- SELECT 'posts' AS type, COUNT(*) FROM public.posts
-- UNION ALL SELECT 'comments', COUNT(*) FROM public.comments
-- UNION ALL SELECT 'votes', COUNT(*) FROM public.votes;

-- Expected: 6 posts, 6 comments, 10 votes

-- Check profiles have display names
-- SELECT id, display_name FROM public.profiles;

-- Test search for "react"
-- SELECT title FROM public.posts, plainto_tsquery('english', 'react') q 
-- WHERE search_vector @@ q;

-- Expected: Posts 1 and 4 (useEffect and rendering)

-- Test tag filter for "javascript"
-- SELECT title FROM public.posts WHERE 'javascript' = ANY(tags);

-- Expected: Posts 2 and 5 (let/const and closures)

-- Vote count per post
-- SELECT p.title, COUNT(v.id) AS upvotes
-- FROM public.posts p
-- LEFT JOIN public.votes v ON v.post_id = p.id
-- GROUP BY p.id, p.title
-- ORDER BY upvotes DESC;

-- Expected: useEffect post has 2 upvotes, let/const has 2 upvotes

-- ============================================================
-- END OF SEED DATA
-- ============================================================