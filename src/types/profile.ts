export type UserRole = "fellow" | "mentor" | "admin";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
}

export const isUserRole = (role: string): role is UserRole => {
  return role === "fellow" || role === "mentor" || role === "admin";
};