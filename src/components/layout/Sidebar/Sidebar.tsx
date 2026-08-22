import Link from "next/link";
import Image from "next/image";
import SidebarNav from "./SidebarNav";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  user: {
    id: string;
    email?: string;
    display_name?: string | null;
    avatar_url?: string | null;
    role?: "fellow" | "mentor" | "admin";
    bio?: string | null;
  } | null;
}

const roleStyles = {
  fellow: "bg-neutral-100 text-neutral-600",
  mentor: "bg-primary-100 text-primary-700",
  admin: "bg-warning/10 text-warning",
};

export default function Sidebar({ user }: SidebarProps) {
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    if (!user?.id) {
      setProfile(user);
      return;
    }

    const supabase = createClient();

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, role")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          ...user,
          display_name: data.display_name,
          avatar_url: data.avatar_url,
          role:
            data.role === "mentor" || data.role === "admin"
              ? data.role
              : "fellow",
        });
      }
    };

    fetchProfile();
  }, [user]);

  const displayName = profile?.display_name || "Fellow";
  const avatarUrl = profile?.avatar_url || null;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const role = profile?.role || "fellow";

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-neutral-900">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center border-b border-neutral-600 bg-success/40">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">
            study<span className="text-primary-500">Circle</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <SidebarNav role={role} />
      </div>

      {/* User info */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {displayName}
            </p>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[user?.role || "fellow"]}`}
            >
              {user?.role || "fellow"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
