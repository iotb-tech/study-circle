"use client"; 
 
import { useEffect, useState, useRef } from "react"; 
import { User, Camera, Loader2 } from "lucide-react"; 
import { createClient } from "@/lib/supabase/client";
interface Profile { 
  id: string; 
  display_name: string | null; 
  avatar_url: string | null; 
} 
 
export default function ProfilePage() { 
  const [profile, setProfile] = useState<Profile | null>(null); 
  const [email, setEmail] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const [uploading, setUploading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null); 
 
  // Create Supabase client inside component 
  const supabase = createClient(); 
 
  useEffect(() => { 
    const fetchProfile = async () => { 
      try { 
        const { data: { user } } = await supabase.auth.getUser(); 
        if (!user) throw new Error("Not authenticated"); 
 
        setEmail(user.email ?? ""); 
 
        const { data, error } = await supabase 
          .from("profiles") 
          .select("id, display_name, avatar_url") 
          .eq("id", user.id) 
          .single(); 
 
        if (error) throw error; 
        setProfile(data as Profile); 
      } catch (err: any) { 
        setError(err.message || "Failed to load profile"); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchProfile(); 
  }, []);
 
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { 
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
 
      setProfile((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev)); 
    } catch (err: any) { 
      setError(err.message || "Failed to upload avatar"); 
    } finally { 
      setUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    } 
  }; 
 
  if (loading) { 
    return ( 
      <div className="flex min-h-screen items-center justify-center"> 
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" /> 
      </div> 
    ); 
  } 
 
  if (error && !profile) { 
    return ( 
      <div className="flex min-h-screen items-center justify-center text-red-500"> 
        {error} 
      </div> 
    ); 
  } 
 
  const avatarUrl = profile?.avatar_url; 
  const displayName = profile?.display_name || "Anonymous"; 
 
  return ( 
    <main className="min-h-screen bg-white px-4 py-8"> 
      <div className="mx-auto max-w-2xl rounded-lg border border-primary-700 bg-neutral-200 p-8 
shadow-sm"> 
        <h1 className="text-2xl font-bold text-neutral-900 text-center">Profile</h1> 
        <p className="mt-1 text-sm font-semibold text-neutral-800 text-center">Manage your personal information</p> 
 
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>} 
 
        <div className="mt-8 flex flex-col items-center"> 
          {/* Avatar */} 
          <div className="relative"> 
            {avatarUrl ? ( 
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="h-28 w-28 rounded-full object-cover" 
              /> 
            ) : ( 
              <div className="flex h-28 w-28 items-center justify-center rounded-full 
bg-neutral-100"> 
                <User className="h-14 w-14 text-neutral-400" /> 
              </div> 
            )} 
 
            {/* Edit button */} 
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading} 
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center 
rounded-full bg-primary-500 text-white shadow hover:bg-primary-600 transition-colors 
disabled:opacity-50" 
              aria-label="Change avatar" 
            > 
              {uploading ? ( 
                <Loader2 className="h-4 w-4 animate-spin" /> 
              ) : ( 
                <Camera className="h-4 w-4" /> 
              )} 
            </button> 
 
            {/* Hidden file input */} 
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              className="hidden" 
            /> 
          </div> 
 
          {/* Display name */} 
          <h2 className="mt-4 text-xl font-semibold text-neutral-900">{displayName}</h2> 
 
          {/* Email */} 
          <p className="text-sm text-neutral-600">{email}</p> 
        </div> 
      </div> 
    </main> 
  ); 
} 
