# Database Migrations

This folder contains SQL migration files for the Study Circle database.

## How to apply migrations

1. Go to the Supabase SQL Editor
2. Copy the contents of the migration file
3. Paste into the SQL Editor
4. Click "Run"

## Migration files

| File | Description |
|------|-------------|
| `first-schema.sql` | Core tables, indexes, RLS, search |
| `seed-data.sql` | Development seed data (posts, comments, votes) | Run second |
| `03_avaatrs_bucket.sql` | Creating a bucket in Supabase storage to store the user profile picture |

## About the schema

### Tables
- **profiles** — Public user data linked to `auth.users` (auto-created via trigger)
- **posts** — Knowledge base entries with full-text search (`search_vector` maintained by trigger)
- **comments** — Discussion threads linked to posts and users
- **votes** — Upvotes on posts or comments with XOR constraint

### Key design decisions
- UUID primary keys on all tables
- Full-text search via `tsvector` with GIN index (weighted: title A, body B, tags C)
- Partial unique indexes enforce one-vote-per-user-per-target
- Row Level Security enabled on all tables
- Profile auto-creation via trigger on `auth.users` insert
- Foreign keys with CASCADE delete for data integrity

## Seed data instructions

The `seed-data.sql` file populates the database with test data: 3 users, 6 realistic posts, 6 comments, and 10 votes for development and testing purposes.

### ⚠️ BEFORE running seed-data.sql:

1. **Create 3 test users** through your app's signup page:
   - Person A: `your-email-1@test.com`
   - Person B: `your-email-2@test.com`
   - Person C: `your-email-3@test.com`

2. **Get their UUIDs** from Supabase Dashboard → Authentication → Users

3. **Replace these placeholders** in `seed-data.sql`:
   - `USER_1_ID` → Person A's actual UUID
   - `USER_2_ID` → Person B's actual UUID
   - `USER_3_ID` → Person C's actual UUID
   - `'Person A'` → Person A's actual display name
   - `'Person B'` → Person B's actual display name
   - `'Person C'` → Person C's actual display name

4. **Find and replace** — most SQL editors have find-and-replace (Ctrl+H or Cmd+H):
   - Search `USER_1_ID` → Replace with first user's UUID
   - Search `USER_2_ID` → Replace with second user's UUID
   - Search `USER_3_ID` → Replace with third user's UUID
   - Search `Person A` → Replace with first user's name
   - Search `Person B` → Replace with second user's name
   - Search `Person C` → Replace with third user's name

## Image Bucket Instructions

1. It is required to copy the schema file named 03_avatars_bucket and paste it in the SQL Editor in Supabase and t `Run`

2. After a few seconds, you should see a message of `Succesful. No rows returned`

3. To confirm, in your project dashboard in Supabase, click on `storage` to see that a bucket has been created for storing the image.

## Creating new migrations

When making schema changes:

1. Create a new migration file with a descriptive name
2. Write the SQL changes
3. Apply via SQL Editor
4. Commit the migration file to Git
5. Open a PR for review