"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import PostCard from "@/components/Discussions/PostCard";

interface BookmarkItem {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  comments_count?: Array<{ count: number }>;
  votes_count?: Array<{ count: number }>;
}

export default function BookmarksPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkItem[]>(
    "bookmarks",
    [],
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch (Next.js)

  return (
    <main className="min-h-screen bg-neutral-200 rounded-xl px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          Your Bookmarks
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg">You haven’t bookmarked any posts yet.</p>
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
