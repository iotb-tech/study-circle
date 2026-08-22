"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole, isUserRole } from "@/types/profile";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfileById } from "@/services/profile";
import Spinner from "@/components/ui/Spinner";
import useTheme from "@/hooks/useTheme";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<UserRole>("fellow");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEmail, setReportEmail] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [showMentorRequestModal, setShowMentorRequestModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfileById(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      const role = profile.role;
      setRole(role && isUserRole(role) ? role : "fellow");
    }
  }, [profile]);

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

      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
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

      const { data: admins, error: adminError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin");

      if (adminError) throw adminError;

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
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
      setShowMentorRequestModal(false);
    } catch (err) {
      console.error("Failed to submit request:", err);
      showMessage("Failed to submit request. Please try again.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc("delete_user", { user_id: user.id });

    if (error) {
      showMessage(`Failed to delete account: ${error.message}`, "error");
      setShowDeleteAccountModal(false);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  const handleSubmitReport = async () => {
    if (!reportEmail.trim() || !reportReason.trim()) return;

    setSubmittingReport(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Create the report
      const { error: reportError } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_email: reportEmail.trim(),
        reason: reportReason.trim(),
      });

      if (reportError) throw reportError;

      // Notify all admins
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin");

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          type: "mention",
          content: `New report filed against ${reportEmail}: ${reportReason.trim().slice(0, 100)}`,
        }));

        await supabase.from("notifications").insert(notifications);
      }

      showMessage("Report submitted. Admins will review it.", "warning");
      setShowReportModal(false);
      setReportEmail("");
      setReportReason("");
    } catch (err) {
      console.error("Failed to submit report:", err);
      showMessage("Failed to submit report. Please try again.", "error");
    } finally {
      setSubmittingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1 dark:text-neutral-200">
          Manage your profile and preferences
        </p>
      </div>

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

      <div className="rounded-lg border border-neutral-200 bg-neutral-50/90 p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 
                focus:ring-2 focus:ring-primary-50 dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 
                focus:ring-2 focus:ring-primary-50 min-h-[100px] resize-y dark:bg-neutral-900 dark:text-white dark:border-neutral-600"
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

      <div className="rounded-lg border border-neutral-200 bg-neutral-50/90 p-6 shadow-md dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Appearance
        </h2>

        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Theme
        </p>

        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
            <input
              type="radio"
              checked={theme === "light"}
              onChange={setLightTheme}
              className="h-4 w-4 accent-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Light
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Use the light theme.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
            <input
              type="radio"
              checked={theme === "dark"}
              onChange={setDarkTheme}
              className="h-4 w-4 accent-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Dark
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Use the dark theme.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50/90 p-6 shadow-md dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Account Role
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
              {role}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {role === "fellow"
                ? "You are a fellow. Request mentor status to help others."
                : role === "mentor"
                  ? "You are a mentor. Thank you for contributing!"
                  : "You are an admin."}
            </p>
          </div>

          {role === "fellow" && (
            <button
              onClick={() => setShowMentorRequestModal(true)}
              className="rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              Request Mentor Status
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-800 dark:border-neutral-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          Report a User
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-200 mb-4">
          Report inappropriate behavior or content to the admins.
        </p>
        <button
          onClick={() => setShowReportModal(true)}
          className="rounded-lg border border-warning px-4 py-2 text-sm font-medium text-warning hover:bg-warning/10 transition-colors cursor-pointer"
        >
          Report User
        </button>
      </div>

      <div className="rounded-lg border border-error/20 bg-error/5 p-6 dark:bg-error/10 dark:shadow-xl shadow-xl">
        <h2 className="text-lg font-semibold text-error mb-2">Danger Zone</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-200 mb-4 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="rounded-lg bg-error px-5 py-2.5 text-sm font-medium text-white hover:bg-error/90 transition-colors cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteAccountModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your posts, comments, and votes will be removed."
        confirmLabel="Delete My Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
      />

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowReportModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Report User
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Please provide the email of the user you&apos;re reporting and a
              reason.
            </p>

            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="user@example.com"
                  label="User's Email"
                />
              </div>

              <div>
                <Textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe what happened..."
                  label="Reason for Report"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportEmail("");
                    setReportReason("");
                  }}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  disabled={
                    !reportEmail.trim() ||
                    !reportReason.trim() ||
                    submittingReport
                  }
                  className="px-4 py-2 rounded-lg bg-warning text-white text-sm font-medium hover:bg-warning/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showMentorRequestModal}
        title="Request Mentor Status"
        message="Are you sure you want to request mentor status? Admins will review your request and notify you of their decision."
        confirmLabel="Submit Request"
        onConfirm={handleRequestMentor}
        onCancel={() => setShowMentorRequestModal(false)}
      />
    </div>
  );
}
