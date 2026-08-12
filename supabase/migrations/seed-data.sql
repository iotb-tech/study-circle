-- ============================================================
-- Study Circle — Seed Data for Development
-- ============================================================
-- ⚠️  IMPORTANT: READ THIS BEFORE RUNNING  ⚠️
-- ============================================================
--
-- This file contains HARDCODED user IDs and display names
-- from one developer's local setup. You MUST replace them
-- with your own test users before running.
--
-- HOW TO USE THIS FILE:
--
-- STEP 1: Create 3 test users via your app's signup page
--   User 1: your-email-1@test.com  (will be "Person A")
--   User 2: your-email-2@test.com  (will be "Person B")
--   User 3: your-email-3@test.com  (will be "Person C")
--
-- STEP 2: Get their UUIDs
--   Go to Supabase Dashboard → Authentication → Users
--   Copy each user's UUID (looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
--
-- STEP 3: Replace the IDs below
--   Search for "USER_1_ID" and replace with User 1's actual UUID
--   Search for "USER_2_ID" and replace with User 2's actual UUID
--   Search for "USER_3_ID" and replace with User 3's actual UUID
--
-- STEP 4: Replace the display names
--   Search for "Person A" and replace with User 1's actual name
--   Search for "Person B" and replace with User 2's actual name
--   Search for "Person C" and replace with User 3's actual name
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
SET display_name = 'Person A' 
WHERE id = 'USER_1_ID';  -- ← REPLACE USER_1_ID with your first user's UUID

UPDATE public.profiles 
SET display_name = 'Person B' 
WHERE id = 'USER_2_ID';  -- ← REPLACE USER_2_ID with your second user's UUID

UPDATE public.profiles 
SET display_name = 'Person C' 
WHERE id = 'USER_3_ID';  -- ← REPLACE USER_3_ID with your third user's UUID

-- Verify profiles updated (uncomment to check)
-- SELECT id, display_name FROM public.profiles;

-- ------------------------------------------------------------
-- 2. CREATE TEST POSTS
-- ------------------------------------------------------------
-- REPLACE ALL USER_1_ID, USER_2_ID, USER_3_ID with your actual UUIDs

INSERT INTO public.posts (id, user_id, title, body, tags) VALUES
(
  -- Post 1: Person A asks about React hooks
  'a1111111-1111-1111-1111-111111111111',
  'USER_1_ID',  -- ← REPLACE with your first user's UUID
  'How do I use useEffect with async functions?',
  E'I''m trying to fetch data from an API inside useEffect, but I keep getting warnings about cleanup functions. Here''s my code:\n\n```jsx\nuseEffect(() => {\n  async function fetchData() {\n    const response = await fetch(''/api/data'');\n    const result = await response.json();\n    setData(result);\n  }\n  fetchData();\n}, []);\n```\n\nThe linter says I need to add fetchData to the dependency array, but if I do that, it causes an infinite loop. What''s the correct pattern for async operations in useEffect?',
  ARRAY['react', 'hooks', 'useeffect', 'async', 'fetch']
),
(
  -- Post 2: Person B asks about JavaScript fundamentals
  'a2222222-2222-2222-2222-222222222222',
  'USER_2_ID',  -- ← REPLACE with your second user's UUID
  'What is the actual difference between let and const in JavaScript?',
  E'I understand that var is function-scoped and shouldn''t be used much anymore. But I''m confused about when to use let versus const. I''ve heard people say "always use const unless you need to reassign" but I see a lot of code using let everywhere.\n\nAlso, I learned that const doesn''t make objects immutable — you can still push to an array declared with const. So what exactly does const prevent? When should I actually use let?',
  ARRAY['javascript', 'variables', 'let', 'const', 'fundamentals']
),
(
  -- Post 3: Person C asks about CSS layout
  'a3333333-3333-3333-3333-333333333333',
  'USER_3_ID',  -- ← REPLACE with your third user's UUID
  'CSS Grid vs Flexbox — when should I use which one?',
  E'I''m building a dashboard layout and I''m not sure whether to use Grid or Flexbox for different sections. I know the basic rule: Flexbox for one-dimensional layouts and Grid for two-dimensional. But in practice, most layouts I see use both.\n\nFor example:\n- A navbar: obviously flexbox\n- A card grid: obviously CSS Grid\n- But what about a form? Or a page with a sidebar? What are your practical rules of thumb?',
  ARRAY['css', 'layout', 'grid', 'flexbox', 'design']
),
(
  -- Post 4: Person A asks about React rendering
  'a4444444-4444-4444-4444-444444444444',
  'USER_1_ID',  -- ← REPLACE with your first user's UUID
  'Why is my React component rendering twice in development?',
  E'I noticed that my components are rendering twice on every state update. I added console.log statements and I can see the render function being called two times for a single setState call.\n\nI read somewhere that this is related to React StrictMode in development, but I want to understand:\n1. Why does StrictMode do this?\n2. Is it actually rendering twice or just simulating it?\n3. Should I be worried about performance in production?\n4. How do I properly debug when renders are doubled?',
  ARRAY['react', 'rendering', 'strict-mode', 'performance', 'debugging']
),
(
  -- Post 5: Person B asks about closures
  'a5555555-5555-5555-5555-555555555555',
  'USER_2_ID',  -- ← REPLACE with your second user's UUID
  'Can someone explain JavaScript closures with a practical example?',
  E'I''ve read the MDN definition: "A closure is the combination of a function bundled together with references to its surrounding state." I understand the textbook example with nested functions, but I''m struggling to understand when and why you''d actually use closures in real code.\n\nI see closures mentioned in relation to event handlers, callbacks, and useEffect in React. Could someone show a practical, real-world example where a closure is the right solution?',
  ARRAY['javascript', 'closures', 'scope', 'fundamentals']
),
(
  -- Post 6: Person C asks about Git workflow
  'a6666666-6666-6666-6666-666666666666',
  'USER_3_ID',  -- ← REPLACE with your third user's UUID
  'What is the correct Git workflow for a team project?',
  E'Our team is starting our first collaborative project and we''re confused about the right Git workflow. We''ve been working directly on main and we keep running into merge conflicts.\n\nI''ve read about feature branches, pull requests, and code reviews. For a small team of 4 people working on a 2-week project, what''s the simplest workflow that prevents us from stepping on each other''s toes? And what do we do when merge conflicts happen?',
  ARRAY['git', 'workflow', 'team', 'branches', 'collaboration']
);

-- ------------------------------------------------------------
-- 3. CREATE TEST COMMENTS
-- ------------------------------------------------------------
-- REPLACE ALL USER_1_ID, USER_2_ID, USER_3_ID with your actual UUIDs

INSERT INTO public.comments (id, post_id, user_id, body) VALUES
(
  -- Person B answers Person A's useEffect question
  'b1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'USER_2_ID',  -- ← REPLACE with your second user's UUID
  E'Great question! You need to handle cleanup properly. The issue is that if the component unmounts before the fetch completes, you''ll get a warning. Here''s the correct pattern:\n\n```jsx\nuseEffect(() => {\n  let cancelled = false;\n  \n  async function fetchData() {\n    const response = await fetch(''/api/data'');\n    const result = await response.json();\n    if (!cancelled) setData(result);\n  }\n  \n  fetchData();\n  return () => { cancelled = true; };\n}, []);\n```\n\nThe cleanup function sets a flag that prevents setting state after unmounting.'
),
(
  -- Person C also answers the useEffect question
  'b2222222-2222-2222-2222-222222222222',
  'a1111111-1111-1111-1111-111111111111',
  'USER_3_ID',  -- ← REPLACE with your third user's UUID
  E'Adding to what Person B said — in React 18+, you can also use AbortController:\n\n```jsx\nuseEffect(() => {\n  const controller = new AbortController();\n  \n  async function fetchData() {\n    try {\n      const response = await fetch(''/api/data'', {\n        signal: controller.signal\n      });\n      const result = await response.json();\n      setData(result);\n    } catch (error) {\n      if (error.name !== ''AbortError'') console.error(error);\n    }\n  }\n  \n  fetchData();\n  return () => controller.abort();\n}, []);\n```\n\nThis is cleaner and handles network errors better.'
),
(
  -- Person A answers Person B's let/const question
  'b3333333-3333-3333-3333-333333333333',
  'a2222222-2222-2222-2222-222222222222',
  'USER_1_ID',  -- ← REPLACE with your first user's UUID
  E'The rule I follow: default to const. Only use let when you KNOW the variable will be reassigned. This makes your code more predictable — when I see `let`, I immediately know "this variable changes later."\n\nAnd yes, you''re right about objects: const prevents reassignment of the variable itself, but doesn''t make the value immutable. `const arr = []; arr.push(1)` works fine, but `arr = [1]` would throw an error.'
),
(
  -- Person B answers Person C's CSS question
  'b4444444-4444-4444-4444-444444444444',
  'a3333333-3333-3333-3333-333333333333',
  'USER_2_ID',  -- ← REPLACE with your second user's UUID
  E'My rule of thumb:\n- If you''re arranging items in a single row or column → Flexbox\n- If you''re defining a 2D layout (rows AND columns) → Grid\n- Forms are usually flexbox (single column, stack vertically)\n- Page layout with sidebar → CSS Grid is cleaner\n\nBut honestly, you can achieve most layouts with either. Pick the one that requires less code for your specific case.'
),
(
  -- Person A also answers the CSS question
  'b5555555-5555-5555-5555-555555555555',
  'a3333333-3333-3333-3333-333333333333',
  'USER_1_ID',  -- ← REPLACE with your first user's UUID
  E'For the specific case of a page with a sidebar: use CSS Grid. You can do `grid-template-columns: 250px 1fr` and it just works. With flexbox you''d need to set widths and worry about wrapping. Grid is more explicit about the layout structure.'
),
(
  -- Person C answers Person B's closures question
  'b6666666-6666-6666-6666-666666666666',
  'a5555555-5555-5555-5555-555555555555',
  'USER_3_ID',  -- ← REPLACE with your third user's UUID
  E'A practical example I use all the time: creating a counter function.\n\n```javascript\nfunction createCounter(start = 0) {\n  let count = start;\n  \n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter(10);\ncounter.increment(); // 11\ncounter.increment(); // 12\ncounter.getCount();  // 12\n```\n\nThe inner functions "close over" the `count` variable. No other code can access or modify `count` except through these methods. This is data privacy without classes!'
);

-- ------------------------------------------------------------
-- 4. CREATE TEST VOTES
-- ------------------------------------------------------------
-- REPLACE ALL USER_1_ID, USER_2_ID, USER_3_ID with your actual UUIDs

-- Upvotes on posts
INSERT INTO public.votes (user_id, post_id, value) VALUES
('USER_2_ID', 'a1111111-1111-1111-1111-111111111111', 1),  -- Person B upvotes Person A's useEffect post
('USER_3_ID', 'a1111111-1111-1111-1111-111111111111', 1),  -- Person C upvotes Person A's useEffect post
('USER_1_ID', 'a2222222-2222-2222-2222-222222222222', 1),  -- Person A upvotes Person B's let/const post
('USER_3_ID', 'a2222222-2222-2222-2222-222222222222', 1),  -- Person C upvotes Person B's let/const post
('USER_1_ID', 'a5555555-5555-5555-5555-555555555555', 1),  -- Person A upvotes Person B's closures post
('USER_2_ID', 'a6666666-6666-6666-6666-666666666666', 1);  -- Person B upvotes Person C's Git post

-- Upvotes on comments
INSERT INTO public.votes (user_id, comment_id, value) VALUES
('USER_1_ID', 'b1111111-1111-1111-1111-111111111111', 1),  -- Person A upvotes Person B's answer on their post
('USER_2_ID', 'b6666666-6666-6666-6666-666666666666', 1),  -- Person B upvotes Person C's closures explanation
('USER_3_ID', 'b3333333-3333-3333-3333-333333333333', 1),  -- Person C upvotes Person A's let/const answer
('USER_1_ID', 'b4444444-4444-4444-4444-444444444444', 1);  -- Person A upvotes Person B's CSS answer

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