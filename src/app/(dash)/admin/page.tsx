"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/profile";
import { Search } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

interface UserWithProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
}

export default function AdminPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Check if current user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch all profiles with their auth emails
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, display_name, role, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      // Get emails from auth (this requires a custom function or we skip emails for now)
      setUsers(profiles as UserWithProfile[]);
      setLoading(false);
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return users;

    const query = debouncedSearchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.display_name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );
  }, [users, debouncedSearchQuery]);

  const pagination = usePagination(filteredUsers, { pageSize: 10 });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold text-neutral-900">
          Access Denied
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          You must be an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm">
        {/* Search bar */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full rounded-lg border border-neutral-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50"
            />
          </div>
        </div>

        {/* User cards instead of table */}
        <div className="divide-y divide-neutral-100">
          {pagination.currentItems.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {(user.display_name || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {user.display_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-warning/10 text-warning"
                      : user.role === "mentor"
                        ? "bg-primary-100 text-primary-700"
                        : "bg-neutral-100 text-neutral-600"
                  } capitalize`}
                >
                  {user.role}
                </span>

                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as UserRole)
                  }
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="fellow">Fellow</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onNextPage={pagination.goToNextPage}
            onPreviousPage={pagination.goToPreviousPage}
            onPageClick={pagination.goToPage}
            onFirstPage={pagination.goToFirstPage}
            onLastPage={pagination.goToLastPage}
          />
        </div>
      </div>
    </div>
  );
}
