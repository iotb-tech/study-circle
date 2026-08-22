import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "fellow" | "mentor" | "admin";
  bio: string | null;
  created_at: string;
}

export const fetchProfileById = async (
  userId: string,
): Promise<UserProfile> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
};
