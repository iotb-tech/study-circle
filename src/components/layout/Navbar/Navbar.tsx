"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, LogOut } from "lucide-react";
import MobileSidebar from "../Sidebar/MobileSidebar";

interface NavbarProps {
  user: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const displayName = user?.display_name || "Fellow";
  const avatarUrl = user?.avatar_url || null;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center gap-4 bg-primary-100 border-b border-primary-600/70 px-4 sm:px-6">
      {/* Mobile hamburger menu */}
      <MobileSidebar />

      {/* Right items */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* User info */}
        <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-neutral-200">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">{initials}</span>
            </div>
          )}
          <span className="text-sm font-medium text-neutral-900">{displayName}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}