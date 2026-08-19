"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, LogOut, X } from "lucide-react";
import MobileSidebar from "../Sidebar/MobileSidebar";

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface NavbarProps {
  user: {
    id: string;
    email?: string;
    display_name?: string | null;
    avatar_url?: string | null;
    role?: "fellow" | "mentor" | "admin";
    bio?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      }
    };

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  const displayName = user?.display_name || "Fellow";
  const avatarUrl = user?.avatar_url || null;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (!error) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 bg-white border-b border-neutral-200 px-4 sm:px-6">
      <MobileSidebar role={user?.role} />

      <div className="flex items-center gap-2 sm:gap-3 ml-auto relative">
        {/* Notification bell */}
        <button
          onClick={() => setShowNotificationModal(true)}
          className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-neutral-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          )}
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
          <span className="text-sm font-medium text-neutral-900">
            {displayName}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNotificationModal(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">
                Notifications
              </h3>
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body - scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto text-neutral-300 mb-4" />
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">
                    No notifications yet
                  </h4>
                  <p className="text-xs text-neutral-500">
                    When you receive notifications, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg border border-neutral-200 p-4 ${
                        !notification.read
                          ? "bg-primary-50/50 border-primary-100"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-neutral-700">
                            {notification.content}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            {new Date(
                              notification.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 shrink-0 cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
