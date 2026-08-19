"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { User, Camera, Loader2, Mail, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfileById } from "@/services/profile";
import Spinner from "@/components/ui/Spinner";

export default function ProfilePage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
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

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      const avatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  const roleStyles = {
    fellow: "bg-neutral-100 text-neutral-600",
    mentor: "bg-primary-100 text-primary-700",
    admin: "bg-warning/10 text-warning",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />

        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name || "Avatar"}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-neutral-100">
                  <User className="h-12 w-12 text-neutral-400" />
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow hover:bg-primary-600 transition-colors disabled:opacity-50"
                aria-label="Change avatar"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[profile.role || "fellow"]}`}
            >
              {profile.role || "fellow"}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            {profile.display_name || "Anonymous"}
          </h1>

          {profile.bio && (
            <>
              <p className="mt-2 text-sm font-semibold text-neutral-700">
                Bio:
              </p>
              <p className="mb-4 text-sm text-neutral-600">{profile.bio}</p>
            </>
          )}

          <p className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
            <Mail size={14} />
            {email}
          </p>

          <p className="flex items-center gap-2 text-xs text-neutral-400 mt-4">
            <Calendar size={14} />
            Joined {new Date(profile.created_at || "").toLocaleDateString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
