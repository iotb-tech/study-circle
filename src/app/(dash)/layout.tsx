"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Navbar from "@/components/layout/Navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type UserRole = "fellow" | "mentor" | "admin";

interface UserProfile {
  id: string;
  email?: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  bio?: string | null;
}

const isUserRole = (role: string): role is UserRole => {
  return role === "fellow" || role === "mentor" || role === "admin";
};

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, role, bio")
        .eq("id", user.id)
        .single();

      const role = profile?.role;

      setUser({
        id: user.id,
        email: user.email,
        display_name: profile?.display_name || null,
        avatar_url: profile?.avatar_url || null,
        role: role && isUserRole(role) ? role : "fellow",
        bio: profile?.bio || null,
      });
      setLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-100">
          <Navbar user={user} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
