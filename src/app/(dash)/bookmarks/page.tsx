"use client";

import { createClient } from "@/lib/supabase/client";
import PostCard from "@/components/Discussions/PostCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

export default function BookmarksPage() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const filteredBookmarks = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return bookmarks;

    const query = debouncedSearchQuery.toLowerCase();
    return bookmarks.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [bookmarks, debouncedSearchQuery]);

  const pagination = usePagination(filteredBookmarks, { pageSize: 6 });

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

        <div className="mb-6">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks by title, body, or tag..."
              className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50"
            />
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 dark:text-neutral-200 italic">
            <p className="text-lg">
              {searchQuery.trim()
                ? "No bookmarks match your search."
                : "You haven't bookmarked any posts yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {pagination.currentItems.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onNextPage={pagination.goToNextPage}
              onPreviousPage={pagination.goToPreviousPage}
              onPageClick={pagination.goToPage}
              onFirstPage={pagination.goToFirstPage}
              onLastPage={pagination.goToLastPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
