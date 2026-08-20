"use client";

import { createClient } from "@/lib/supabase/client";
import PostCard from "@/components/Discussions/PostCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";

export default function BookmarksPage() {
  const supabase = createClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select(
          `
          post_id,
          posts (
            id, title, body, tags, created_at,
            profiles:user_id (display_name, avatar_url, role),
            comments_count:comments(count),
            votes_count:votes(count)
          )
        `,
        )
        .eq("user_id", user.id);

      if (error) throw error;

      return data
        .map((item) => item.posts)
        .filter((post): post is NonNullable<typeof post> => post !== null)
        .map((post) => ({
          id: post.id,
          title: post.title,
          body: post.body,
          tags: post.tags,
          created_at: post.created_at,
          profiles: post.profiles
            ? {
                display_name: post.profiles.display_name,
                avatar_url: post.profiles.avatar_url,
                role: post.profiles.role as "fellow" | "mentor" | "admin",
              }
            : null,
          comments_count: post.comments_count,
          votes_count: post.votes_count,
        }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen rounded-xl px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          Your Bookmarks
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 dark:text-neutral-200 italic">
            <p className="text-lg">
              You haven&apos;t bookmarked any posts yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
