# Database Migrations

This folder contains SQL migration files for the Study Circle database.

## How to apply migrations

1. Go to the Supabase SQL Editor
2. Copy the contents of the migration file
3. Paste into the SQL Editor
4. Click "Run"

---

## Migration files

| File                           | Description                                                             |
| ------------------------------ | ----------------------------------------------------------------------- | ----------- |
| `01_first_schema.sql`          | Core tables, indexes, RLS, search                                       |
| `02_seed_data.sql`             | Development seed data (posts, comments, votes)                          | Run second  |
| `03_avaatrs_bucket.sql`        | Creating a bucket in Supabase storage to store the user profile picture |
| `04_user_roles_and_bio.sql`    | Add role (fellow/mentor/admin), bio, and notifications                  | Run fourth  |
| `05_fix_notifications_rls.sql` | Fix notifications RLS for cross-user notifications                      | Run fifth   |
| `06_admin_update_policy.sql`   | Allow admins to update any profile                                      | Run sixth   |
| `07_bookmarks.sql`             | Bookmarks table for saving posts                                        | Run seventh |
| `08_add_email_to_profiles.sql` | Add email column to profiles for admin display                          |
| `09_delete_user_function.sql`  | Database function for proper user deletion                              |
| `10_admin_content_moderation.sql` | Allow admins to delete any post or comment    |
| `11_user_reports.sql` | Reports table for user reporting system |
| `12_suspend_user.sql` | Add suspended column to profiles |

---

## About the schema

### Tables

- **profiles** — Public user data linked to `auth.users` (auto-created via trigger)
- **posts** — Knowledge base entries with full-text search (`search_vector` maintained by trigger)
- **comments** — Discussion threads linked to posts and users
- **votes** — Upvotes on posts or comments with XOR constraint
- **notifications** — User notifications for role requests, comments, and votes
- **bookmarks** — Saved posts per user
- **reports** — User reports for moderation

### Key design decisions

- UUID primary keys on all tables
- Full-text search via `tsvector` with GIN index (weighted: title A, body B, tags C)
- Partial unique indexes enforce one-vote-per-user-per-target
- Row Level Security enabled on all tables
- Profile auto-creation via trigger on `auth.users` insert
- Foreign keys with CASCADE delete for data integrity
- Email stored in profiles for admin panel display
- Database function for user deletion (cascades to all related data)
- Admin moderation policies for content management
- User suspension system for account management

---

## Seed data instructions

The `02_seed_data.sql` file populates the database with test data: 3 users, 6 realistic posts, 6 comments, and 10 votes for development and testing purposes.

### Before running seed data:

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

4. **Use find-and-replace (Ctrl+H or Cmd+H)** — most SQL editors have find-and-replace (Ctrl+H or Cmd+H):

---

## Image Bucket Instructions

1. It is required to copy the schema file named `03_avatars_bucket.sql` and paste it in the SQL Editor in Supabase and click on `Run`
2. After a few seconds, you should see a message of `Succesful. No rows returned`
3. To confirm, in your project dashboard in Supabase, click on `storage` to see that a bucket has been created for storing the image.

---

## User Roles

The system supports three roles:

| Role       | Description                | Permissions                           |
| ---------- | -------------------------- | ------------------------------------- |
| **fellow** | Default role for new users | Create posts, comment, vote           |
| **mentor** | Approved contributors      | All fellow permissions + mentor badge |
| **admin**  | System administrators      | All permissions + manage user roles   |

### Setting an Admin (Development)

```sql
-- Replace with the admin's email
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
```

### Role Request Flow

1. Fellow requests mentor status from Settings
2. All admins receive notification
3. Admin approves/rejects from Admin Panel
4. User receives notification of approval

---

## Creating new migrations

When making schema changes:

1. Create a new migration file with a descriptive name
2. Write the SQL changes
3. Apply via SQL Editor
4. Commit the migration file to Git
5. Open a PR for review
