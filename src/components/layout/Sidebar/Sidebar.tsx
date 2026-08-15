import Link from "next/link";
import Image from "next/image";
import SidebarNav from "./SidebarNav";

interface SidebarProps {
  user: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const displayName = user?.display_name || "Fellow";
  const avatarUrl = user?.avatar_url || null;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-neutral-900">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-white">
            study<span className="text-primary-500">Circle</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <SidebarNav />
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
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-neutral-500">Fellow</p>
          </div>
        </div>
      </div>
    </aside>
  );
}