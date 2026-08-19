import { createClient } from "@/lib/supabase/client";

export interface PostDetail {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    role?: "fellow" | "mentor" | "admin";
  } | null;
  votes: Array<{ id: string; user_id: string; value: number }>;
}

export const fetchPostById = async (postId: string): Promise<PostDetail> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (display_name, role),
      votes (id, user_id, value)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data as unknown as PostDetail;
};
