"use client";

import { Search, X } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagRemove: (tag: string) => void;
  onClearAllTags: () => void;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagRemove,
  onClearAllTags,
}: SearchAndFilterProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search posts by title or body content..."
          className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50"
        />
      </div>
    </div>
  );
}
