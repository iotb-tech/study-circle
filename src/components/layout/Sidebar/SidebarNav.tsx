"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  User,
  Settings,
  Shield,
} from "lucide-react";

interface SidebarNavProps {
  role?: "fellow" | "mentor" | "admin";
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discussions", label: "Discussions", icon: MessageSquare },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  // Add admin link only if user is admin
  const allNavItems =
    role === "admin"
      ? [...navItems, { href: "/admin", label: "Admin", icon: Shield }]
      : navItems;

  return (
    <nav className="space-y-1">
      {allNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-500 text-white"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
