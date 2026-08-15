"use client";

import { KPIContainer, KPICard } from "@/components/Dashboard/KPI";
import {
  PostsOverTime,
  TopTags,
  EngagementDistribution,
  WeeklyActivity,
  TopContributors,
} from "@/components/Dashboard/Charts";
import {
  postsOverTimeData,
  topTagsData,
  engagementData,
  weeklyActivityData,
  topContributorsData,
} from "@/lib/dashboard-sample-data";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      {/* KPI Cards */}
      <KPIContainer columns={4}>
        <KPICard
          title="Total Posts"
          value="42"
          subtitle="Across all categories"
          accentColor="primary"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
        />
        <KPICard
          title="Total Comments"
          value="85"
          subtitle="Engagement on posts"
          accentColor="success"
          trend={{ value: 8, direction: 'up', label: 'vs last month' }}
        />
        <KPICard
          title="Total Votes"
          value="120"
          subtitle="Upvotes on posts and comments"
          accentColor="warning"
          trend={{ value: 15, direction: 'up', label: 'vs last month' }}
        />
        <KPICard
          title="Active Users"
          value="25"
          subtitle="Contributing this week"
          accentColor="brown"
          trend={{ value: 3, direction: 'down', label: 'vs last month' }}
        />
      </KPIContainer>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PostsOverTime data={postsOverTimeData} />
        <EngagementDistribution data={engagementData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopTags data={topTagsData} />
        <WeeklyActivity data={weeklyActivityData} />
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 gap-4">
        <TopContributors data={topContributorsData} />
      </div>
    </div>
  );
}