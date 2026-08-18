-- Create the avatars bucket if it does not exist 
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing; 
 
-- Allow authenticated users to upload files to the avatars bucket 
drop policy if exists "Users can upload avatars" on storage.objects; 
create policy "Users can upload avatars"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- Allow public read access (for public bucket)
drop policy if exists "Public read access for avatars" on storage.objects;
create policy "Public read access for avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- Optional: Allow users to update/delete their own files
drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');
drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars');