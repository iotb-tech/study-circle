"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  User,
  Settings,
  Menu,
  X,
  Shield,
} from "lucide-react";

interface MobileSidebarProps {
  role?: "fellow" | "mentor" | "admin";
}

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const allNavItems =
    role === "admin"
      ? [...navItems, { href: "/admin", label: "Admin", icon: Shield }]
      : navItems;

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-neutral-600" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-neutral-900 z-50 transform transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            study<span className="text-primary-500">Circle</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-800"
          >
            <X size={18} className="text-neutral-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {allNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
      </aside>
    </>
  );
}
