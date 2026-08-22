"use client";

import { KPIContainer, KPICard } from "@/components/Dashboard/KPI";
import {
  PostsOverTime,
  TopTags,
  EngagementDistribution,
  TopContributors,
} from "@/components/Dashboard/Charts";
import { FileText, MessageSquare, ThumbsUp, User } from "lucide-react";

// TypeScript interface that defines what data this component expects
interface DashboardContentProps {
  data: {
    kpis: {
      totalPosts: number;
      userPosts: number;
      totalComments: number;
      userComments: number;
      totalVotes: number;
      userVotes: number;
    };
    charts: {
      postsOverTime: Array<{
        date: string;
        posts: number;
        comments: number;
        votes: number;
      }>;
      topTags: Array<{ tag: string; count: number }>;
      engagement: Array<{ name: string; value: number }>;
      topContributors: Array<{ name: string; contributions: number }>;
    };
  };
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const { kpis, charts } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-200 mt-1">
          Overview of your activity and community engagement
        </p>
      </div>

      {/* KPI Cards — 6 cards now (4 general + 2 personal) */}
      <KPIContainer columns={4}>
        {/* Community KPIs */}
        <KPICard
          title="Total Posts"
          value={kpis.totalPosts}
          subtitle="Across all topics"
          icon={<FileText size={20} />}
          accentColor="primary"
        />
        <KPICard
          title="Total Comments"
          value={kpis.totalComments}
          subtitle="Community engagement"
          icon={<MessageSquare size={20} />}
          accentColor="success"
        />
        <KPICard
          title="Total Votes"
          value={kpis.totalVotes}
          subtitle="Upvotes given"
          icon={<ThumbsUp size={20} />}
          accentColor="warning"
        />

        {/* Personal KPIs */}
        <KPICard
          title="Your Posts"
          value={kpis.userPosts}
          subtitle="Questions you've asked"
          icon={<User size={20} />}
          accentColor="brown"
        />
        <KPICard
          title="Your Comments"
          value={kpis.userComments}
          subtitle="Answers you've given"
          icon={<MessageSquare size={20} />}
          accentColor="brown"
        />
        <KPICard
          title="Your Votes"
          value={kpis.userVotes}
          subtitle="Posts you've upvoted"
          icon={<ThumbsUp size={20} />}
          accentColor="brown"
        />
      </KPIContainer>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PostsOverTime data={charts.postsOverTime} />
        <EngagementDistribution data={charts.engagement} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopTags data={charts.topTags} />
        <TopContributors data={charts.topContributors} />
      </div>
    </div>
  );
}
