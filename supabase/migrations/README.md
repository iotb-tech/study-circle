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

## Seed data

The `seed-data.sql` file populates the database with 3 users, 6 realistic posts, 6 comments, and 10 votes for development and testing purposes.

**Before running seed data:**
1. Create test users through the application signup page
2. Get their UUIDs from Supabase → Authentication → Users
3. Update the UUIDs in the seed file if using different test users

## Creating new migrations

When making schema changes:

1. Create a new migration file with a descriptive name
2. Write the SQL changes
3. Apply via SQL Editor
4. Commit the migration file to Git
5. Open a PR for review