import { createClient } from "@/lib/supabase/client";

export interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    role?: "fellow" | "mentor" | "admin";
  } | null;
  votes: Array<{ id: string; user_id: string; value: number }>;
}

export const fetchCommentsByPostId = async (
  postId: string,
): Promise<Comment[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles:user_id (display_name, role, email),
      votes (id, user_id, value)
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as unknown as Comment[];
};
