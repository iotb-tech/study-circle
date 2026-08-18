"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import CreatePostForm from "@/components/Discussions/CreatePostForm";
import PostCard from "@/components/Discussions/PostCard";
import SearchAndFilter from "@/components/Discussions/SearchAndFilter";
import { Search, FileQuestion } from "lucide-react";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import useDebounce from "@/hooks/useDebounce";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  comments_count: Array<{ count: number }>;
  votes_count: Array<{ count: number }>;
}

export default function DiscussionsPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "discussions-search",
    "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (display_name, avatar_url),
        comments_count:comments(count),
        votes_count:votes(count)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) => post.tags?.includes(tag)),
      );
    }

    return filtered;
  }, [posts, debouncedSearchQuery, selectedTags]);

  const pagination = usePagination(filteredPosts, { pageSize: 6 });

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      pagination.goToFirstPage();
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    pagination.goToFirstPage();
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    pagination.goToFirstPage();
  };

  const hasSearchQuery = debouncedSearchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Discussions</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Ask questions, share knowledge, and learn together
        </p>
      </div>

      {/* Create Post Form */}
      <CreatePostForm />

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagRemove={handleTagRemove}
        onClearAllTags={handleClearAllTags}
      />

      {/* Empty state: No search */}
      {!hasSearchQuery && selectedTags.length === 0 && posts.length > 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <Search size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-700 mb-2">
            Search for posts
          </h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            Use the search bar above to find posts by title or body content. You
            can also click on tags to filter posts.
          </p>
        </div>
      )}

      {/* Empty state: No results */}
      {(hasSearchQuery || selectedTags.length > 0) &&
        filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <FileQuestion size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">
              No posts found
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              We couldn&apos;t find any posts matching your search criteria. Try
              different keywords or remove some filters.
            </p>
          </div>
        )}

      {/* Posts grid */}
      {pagination.currentItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pagination.currentItems.map((post) => (
            <PostCard key={post.id} post={post} onTagClick={handleTagClick} />
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
        </div>
      )}

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
    </div>
  );
}
