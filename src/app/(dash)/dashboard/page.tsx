import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard-data";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch all dashboard data for this user
  const data = await getDashboardData(user.id);

  // Pass data to the client component
  return <DashboardContent data={data} />;
}