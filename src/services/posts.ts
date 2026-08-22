import { createClient } from "@/lib/supabase/client";

export interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    role?: "fellow" | "mentor" | "admin";
  } | null;
  comments_count: Array<{ count: number }>;
  votes_count: Array<{ count: number }>;
}

export const fetchPosts = async (): Promise<Post[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (display_name, avatar_url, role, email),
      comments_count:comments(count),
      votes_count:votes(count)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  // Sort by vote count (highest first), then by created_at for ties
  const sortedPosts = (data as unknown as Post[]).sort((a, b) => {
    const votesA = a.votes_count?.[0]?.count || 0;
    const votesB = b.votes_count?.[0]?.count || 0;

    if (votesB !== votesA) {
      return votesB - votesA;
    }

    // If same vote count, sort by newest first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return sortedPosts;
};
