"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PostCard from "@/components/Discussions/PostCard";

interface BookmarkItem {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    role?: "fellow" | "mentor" | "admin";
  } | null;
  comments_count?: Array<{ count: number }>;
  votes_count?: Array<{ count: number }>;
}

export default function BookmarksPage() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

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

      if (error) {
        console.error("Error fetching bookmarks:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        const bookmarkedPosts = data
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

        setBookmarks(bookmarkedPosts);
      }
      setLoading(false);
    };

    fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-200 rounded-xl px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          Your Bookmarks
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
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
