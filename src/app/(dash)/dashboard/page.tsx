"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { fetchDashboardData } from "@/services/dashboard";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", userId],
    queryFn: () => fetchDashboardData(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Failed to load dashboard data.</p>
      </div>
    );
  }

  return <DashboardContent data={data} />;
}
