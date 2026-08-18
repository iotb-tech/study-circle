"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
  } | null;
  votes: Array<{ id: string; user_id: string; value: number }>;
}

interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
  } | null;
  votes: Array<{ id: string; user_id: string; value: number }>;
}

export default function PostDetailPage() {
    const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasVotedOnPost, setHasVotedOnPost] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      await fetchPost();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (display_name),
        votes (id, user_id, value)
      `,
      )
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError.message);
      return;
    }

    if (postData) {
      setPost(postData as unknown as Post);

      setHasVotedOnPost(
        postData.votes?.some(
          (v: { user_id: string }) => v.user_id === currentUserId,
        ) || false,
      );
    }

    const { data: commentsData } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (display_name),
        votes (id, user_id, value)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsData) {
      setComments(commentsData as unknown as Comment[]);
    }

    setLoading(false);
  };
  return (
    <div>
      
    </div>
  )
}
