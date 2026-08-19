"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CreatePostForm from "@/components/Discussions/CreatePostForm";
import PostCard from "@/components/Discussions/PostCard";
import SearchAndFilter from "@/components/Discussions/SearchAndFilter";
import { Search, FileQuestion } from "lucide-react";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import useDebounce from "@/hooks/useDebounce";
import useLocalStorage from "@/hooks/useLocalStorage";
import { fetchPosts } from "@/services/posts";

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "discussions-search",
    "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Failed to load posts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Discussions</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-200 mt-1">
          Ask questions, share knowledge, and learn together
        </p>
      </div>

      <CreatePostForm />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagRemove={handleTagRemove}
        onClearAllTags={handleClearAllTags}
      />

      {!hasSearchQuery && selectedTags.length === 0 && posts.length > 0 && (
        <div className="text-center py-12 bg-neutral-100 rounded-lg border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
          <Search size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">
            Search for posts
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Use the search bar above to find posts by title or body content. You
            can also click on tags to filter posts.
          </p>
        </div>
      )}

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

      {pagination.currentItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pagination.currentItems.map((post) => (
            <PostCard key={post.id} post={post} onTagClick={handleTagClick} />
          ))}
        </div>
      )}

      {isLoading && (
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
