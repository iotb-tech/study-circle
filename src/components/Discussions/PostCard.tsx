"use client";

import { useRouter } from "next/navigation";
import { Bookmark, MessageSquare, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    body: string;
    tags: string[];
    created_at: string;
    profiles: {
      display_name: string | null;
      avatar_url: string | null;
      role?: "fellow" | "mentor" | "admin";
      email?: string | null;
    } | null;
    comments_count?: Array<{ count: number }>;
    votes_count?: Array<{ count: number }>;
  };
  onTagClick?: (tag: string) => void;
}

export default function PostCard({ post, onTagClick }: PostCardProps) {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showRemoveBookmarkModal, setShowRemoveBookmarkModal] = useState(false);
  const displayName = post.profiles?.display_name || "Anonymous";
  const initials = displayName.charAt(0).toUpperCase();
  const truncatedBody =
    post.body.length > 200 ? post.body.slice(0, 200) + "..." : post.body;

  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmark", post.id],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("post_id", post.id)
        .single();

      return data;
    },
  });

  const isBookmarked = !!bookmarkData;

  const handleConfirmRemoveBookmark = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", post.id);

    setShowRemoveBookmarkModal(false);
    queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    queryClient.invalidateQueries({ queryKey: ["bookmark", post.id] });
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isBookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post.id);
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        post_id: post.id,
      });
    }

    queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    queryClient.invalidateQueries({ queryKey: ["bookmark", post.id] });
  };

  return (
    <div
      onClick={() => router.push(`/discussions/${post.id}`)}
      className={cn(
        "group relative cursor-pointer rounded-lg border border-primary-100 bg-primary-50/50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-primary-50",
      )}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
        {post.title}
      </h3>

      {/* Body preview */}
      <p className="text-sm text-neutral-600 line-clamp-3 mb-4">
        {truncatedBody}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium 
                hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Footer: Author, date, stats */}
      <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 dark:border-neutral-500 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-medium text-primary-700">
              {initials}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-600 dark:text-neutral-900 font-medium">{displayName}</span>
            {post.profiles?.email && (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{post.profiles.email}</p>
            )}
          </div>

          {post.profiles?.role === "mentor" && (
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
              Mentor
            </span>
          )}
          {post.profiles?.role === "admin" && (
            <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
              Admin
            </span>
          )}

          <span className="dark:text-neutral-500 font-bold text-xl">·</span>
          <span className="dark:text-neutral-500">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 dark:text-neutral-500">
            <MessageSquare size={14} />
            {post.comments_count?.[0]?.count || 0}
          </span>
          <span className="flex items-center gap-1 dark:text-neutral-500">
            <ThumbsUp size={14} />
            {post.votes_count?.[0]?.count || 0}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isBookmarked) {
                setShowRemoveBookmarkModal(true);
              } else {
                toggleBookmark(e);
              }
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            title="Bookmark"
            className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 transition-colors hover:text-primary-600 cursor-pointer"
          >
            <Bookmark
              size={14}
              className={
                isBookmarked ? "fill-primary-500 text-primary-500" : ""
              }
            />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showRemoveBookmarkModal}
        title="Remove Bookmark"
        message="Are you sure you want to remove this bookmark?"
        confirmLabel="Remove"
        onConfirm={handleConfirmRemoveBookmark}
        onCancel={() => setShowRemoveBookmarkModal(false)}
      />
    </div>
  );
}
