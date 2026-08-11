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
| 001_initial_schema.sql | Core tables, indexes, RLS, search |

## Creating new migrations

When making schema changes:

1. Create a new migration file: `00X_description.sql`
2. Write the SQL changes
3. Apply via SQL Editor
4. Commit the migration file to Git
5. Open a PR for review