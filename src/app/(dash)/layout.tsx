import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check authentication on the SERVER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to signin
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* <Sidebar /> */}
      {/* <Navbar /> */}
      <main>{children}</main>
    </div>
  );
}