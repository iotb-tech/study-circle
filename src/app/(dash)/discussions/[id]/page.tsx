"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPostById } from "@/services/postDetail";
import { fetchCommentsByPostId } from "@/services/comments";
import Spinner from "@/components/ui/Spinner";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const postId = params.id as string;
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasVotedOnPost, setHasVotedOnPost] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [voteWarning, setVoteWarning] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState(false);
  const [editedPostBody, setEditedPostBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentBody, setEditedCommentBody] = useState("");
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<
    string | null
  >(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
      }
    };
    getUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsByPostId(postId),
  });

  const invalidatePost = () => {
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  };

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

  const handleVoteOnPost = async () => {
    if (!currentUserId) return;

    const { data: postVote } = await supabase
      .from("votes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", currentUserId)
      .maybeSingle();

    if (postVote) {
      await supabase.from("votes").delete().eq("id", postVote.id);
      setHasVotedOnPost(false);
      invalidatePost();
      return;
    }

    const { data: postComments } = await supabase
      .from("comments")
      .select("id")
      .eq("post_id", postId);

    if (postComments && postComments.length > 0) {
      const commentIds = postComments.map((c) => c.id);
      const { data: commentVote } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", currentUserId)
        .in("comment_id", commentIds)
        .limit(1)
        .maybeSingle();

      if (commentVote) {
        setVoteWarning(
          "You already voted on a comment in this post. Remove your comment vote first.",
        );
        return;
      }
    }

    await supabase.from("votes").insert({
      user_id: currentUserId,
      post_id: postId,
      value: 1,
    });

    setHasVotedOnPost(true);
    invalidatePost();
  };

  const handleVoteOnComment = async (commentId: string) => {
    if (!currentUserId) return;

    const { data: postVote } = await supabase
      .from("votes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", currentUserId)
      .single();

    if (postVote) {
      setVoteWarning(
        "You already voted on this post. Remove your post vote first.",
      );
      return;
    }

    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", currentUserId)
      .single();

    if (existingVote) {
      await supabase.from("votes").delete().eq("id", existingVote.id);
    } else {
      await supabase.from("votes").insert({
        user_id: currentUserId,
        comment_id: commentId,
        value: 1,
      });
    }

    invalidateComments();
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) return;

    setSubmittingComment(true);

    // Get the commenter's role
    const { data: commenterProfile } = await supabase
      .from("profiles")
      .select("role, display_name")
      .eq("id", currentUserId)
      .single();

    const commenterRole = commenterProfile?.role || "fellow";
    const commenterName = commenterProfile?.display_name || "A user";

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      body: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      invalidateComments();

      // If mentor or admin comments, notify all fellows
      if (commenterRole === "mentor" || commenterRole === "admin") {
        const { data: fellows } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "fellow");

        if (fellows && fellows.length > 0) {
          const notifications = fellows.map((fellow) => ({
            user_id: fellow.id,
            type: "mention",
            content: `(${commenterRole}) ${commenterName} commented on a post`,
          }));

          await supabase.from("notifications").insert(notifications);
        }
      }
    }
    setSubmittingComment(false);
  };

  const handleEditPost = async () => {
    if (!editedPostBody.trim()) return;
    const { error } = await supabase
      .from("posts")
      .update({ body: editedPostBody })
      .eq("id", postId);
    if (!error) {
      setEditingPost(false);
      invalidatePost();
    }
  };

  const confirmDeletePost = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      router.push("/discussions");
    }
    setShowDeletePostModal(false);
  };

  const handleEditComment = async (commentId: string) => {
    if (!editedCommentBody.trim()) return;
    const { error } = await supabase
      .from("comments")
      .update({ body: editedCommentBody })
      .eq("id", commentId);
    if (!error) {
      setEditingCommentId(null);
      invalidateComments();
    }
  };

  const confirmDeleteComment = async () => {
    if (!showDeleteCommentModal) return;
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", showDeleteCommentModal);
    if (!error) {
      invalidateComments();
    }
    setShowDeleteCommentModal(null);
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Go Back
      </button>

      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-4 text-sm text-neutral-500">
          <span>{post.profiles?.display_name || "Anonymous"}</span>
          <span>·</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <p className="text-base text-neutral-700 whitespace-pre-wrap mb-4">
          {post.body}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
          <button
            onClick={handleVoteOnPost}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer",
              hasVotedOnPost
                ? "bg-primary-50 text-primary-700"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}
          >
            <ThumbsUp size={16} />
            {hasVotedOnPost ? "Voted" : "Vote"} ({post.votes?.length || 0})
          </button>
        </div>

        {(currentUserId === post.user_id || isAdmin) && (
          <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
            {!editingPost ? (
              <>
                <button
                  onClick={() => {
                    setEditingPost(true);
                    setEditedPostBody(post.body);
                  }}
                  className="text-xs text-neutral-500 hover:text-primary-600 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeletePostModal(true)}
                  className="text-xs text-error hover:text-error/80 cursor-pointer"
                >
                  Delete
                </button>
              </>
            ) : (
              <div className="w-full space-y-2">
                <textarea
                  value={editedPostBody}
                  onChange={(e) => setEditedPostBody(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditPost}
                    className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPost(false)}
                    className="text-xs border border-neutral-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-24">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h2>

        {comments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-neutral-200">
            <MessageSquare
              size={32}
              className="mx-auto text-neutral-300 mb-2"
            />
            <p className="text-sm text-neutral-500">
              No comments yet. Be the first to respond!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-700">
                      {(comment.profiles?.display_name || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {comment.profiles?.display_name || "Anonymous"}
                  </span>

                  {comment.profiles?.role === "mentor" && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-medium">
                      Mentor
                    </span>
                  )}
                  {comment.profiles?.role === "admin" && (
                    <span className="px-1.5 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-medium">
                      Admin
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                  {comment.body}
                </p>

                <button
                  onClick={() => handleVoteOnComment(comment.id)}
                  className={cn(
                    "mt-2 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                    comment.votes?.some((v) => v.user_id === currentUserId)
                      ? "bg-primary-50 text-primary-700"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  )}
                >
                  <ThumbsUp size={12} />
                  {comment.votes?.some((v) => v.user_id === currentUserId)
                    ? "Voted"
                    : "Vote"}{" "}
                  ({comment.votes?.length || 0})
                </button>

                {(currentUserId === comment.user_id || isAdmin) && (
                  <div className="flex items-center gap-2 mt-2">
                    {editingCommentId === comment.id ? (
                      <div className="w-full space-y-2">
                        <textarea
                          value={editedCommentBody}
                          onChange={(e) => setEditedCommentBody(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-xs border border-neutral-200 px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedCommentBody(comment.body);
                          }}
                          className="text-xs text-neutral-500 hover:text-primary-600 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteCommentModal(comment.id)}
                          className="text-xs text-error hover:text-error/80 cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white rounded-xl shadow-xl border-t border-neutral-200 p-4 -mx-4 sm:-mx-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg border border-neutral-200 px-4 py-3 text-sm resize-y min-h-[60px] max-h-[150px] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submittingComment}
            className="px-6 py-3 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submittingComment ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {voteWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Voting restriction
            </h3>
            <p className="text-sm text-neutral-600 leading-6">{voteWarning}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setVoteWarning(null)}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors cursor-pointer"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeletePostModal}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={confirmDeletePost}
        onCancel={() => setShowDeletePostModal(false)}
      />

      <ConfirmModal
        isOpen={!!showDeleteCommentModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={confirmDeleteComment}
        onCancel={() => setShowDeleteCommentModal(null)}
      />
    </div>
  );
}
