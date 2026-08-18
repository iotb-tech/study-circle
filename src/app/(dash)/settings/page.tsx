"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole, isUserRole } from "@/types/profile";

export default function SettingsPage() {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<UserRole>("fellow");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, bio, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        const role = profile.role;
        setRole(role && isUserRole(role) ? role : "fellow");
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showMessage = (msg: string, type: "success" | "error" | "warning") => {
    setMessage({ text: msg, type });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      showMessage("Profile updated successfully!", "success");
    } catch {
      showMessage("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestMentor = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Create a notification for admins
      const { data: admins, error: adminError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin");

      if (adminError) throw adminError;

      // Create notification for EACH admin
      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id, // ← Send to admin's ID
          type: "role_request" as const,
          content: `${user.email || "A user"} has requested mentor status`,
        }));

        const { error: notifError } = await supabase
          .from("notifications")
          .insert(notifications);

        if (notifError) throw notifError;
      }

      showMessage(
        "Mentor status requested! An admin will review your request.",
        "warning",
      );
    } catch (err) {
      console.error("Failed to submit request:", err);
      showMessage("Failed to submit request. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      {/* Message display */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : message.type === "error"
                ? "bg-error/10 border border-error/20 text-error"
                : "bg-warning/10 border border-warning/20 text-warning"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 min-h-[100px] resize-y"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Role Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Account Role
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900 capitalize">
              {role}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {role === "fellow"
                ? "You are a fellow. Request mentor status to help others."
                : role === "mentor"
                  ? "You are a mentor. Thank you for contributing!"
                  : "You are an admin."}
            </p>
          </div>

          {role === "fellow" && (
            <button
              onClick={handleRequestMentor}
              className="rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              Request Mentor Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
