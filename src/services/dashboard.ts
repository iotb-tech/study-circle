import { createClient } from "@/lib/supabase/client";

export interface DashboardData {
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
}

function processPostsOverTime(
  posts: Array<{ created_at: string }>,
  comments: Array<{ created_at?: string }>,
) {
  const grouped = new Map<
    string,
    { date: string; posts: number; comments: number; votes: number }
  >();

  posts.forEach((post) => {
    const date = new Date(post.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!grouped.has(date)) {
      grouped.set(date, { date, posts: 0, comments: 0, votes: 0 });
    }

    grouped.get(date)!.posts += 1;
  });

  comments.forEach((comment) => {
    if (comment.created_at) {
      const date = new Date(comment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!grouped.has(date)) {
        grouped.set(date, { date, posts: 0, comments: 0, votes: 0 });
      }

      grouped.get(date)!.comments += 1;
    }
  });

  return Array.from(grouped.values());
}

function processTopTags(posts: Array<{ tags: string[] | null }>) {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function processTopContributors(
  posts: Array<{
    user_id: string;
    profiles: { display_name: string | null } | null;
  }>,
) {
  const contributorCounts = new Map<
    string,
    { name: string; contributions: number }
  >();

  posts.forEach((post) => {
    const name = post.profiles?.display_name || "Anonymous";

    if (!contributorCounts.has(post.user_id)) {
      contributorCounts.set(post.user_id, { name, contributions: 0 });
    }

    contributorCounts.get(post.user_id)!.contributions += 1;
  });

  return Array.from(contributorCounts.values())
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);
}

export const fetchDashboardData = async (
  userId: string,
): Promise<DashboardData> => {
  const supabase = createClient();

  const [
    totalPostsResult,
    userPostsResult,
    totalCommentsResult,
    userCommentsResult,
    totalVotesResult,
    userVotesResult,
    postsOverTimeResult,
    topTagsResult,
    commentsResult,
    topContributorsResult,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("votes").select("id", { count: "exact", head: true }),
    supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("posts")
      .select("created_at")
      .order("created_at", { ascending: true }),
    supabase.from("posts").select("tags"),
    supabase.from("comments").select("created_at"),
    supabase
      .from("posts")
      .select("user_id, profiles(display_name)")
      .order("created_at", { ascending: false }),
  ]);

  const postsOverTime = processPostsOverTime(
    postsOverTimeResult.data || [],
    commentsResult.data || [],
  );
  const topTags = processTopTags(topTagsResult.data || []);
  const engagement = [
    { name: "Posts", value: totalPostsResult.count || 0 },
    { name: "Comments", value: totalCommentsResult.count || 0 },
    { name: "Votes", value: totalVotesResult.count || 0 },
  ];
  const topContributors = processTopContributors(
    topContributorsResult.data || [],
  );

  return {
    kpis: {
      totalPosts: totalPostsResult.count || 0,
      userPosts: userPostsResult.count || 0,
      totalComments: totalCommentsResult.count || 0,
      userComments: userCommentsResult.count || 0,
      totalVotes: totalVotesResult.count || 0,
      userVotes: userVotesResult.count || 0,
    },
    charts: {
      postsOverTime,
      topTags,
      engagement,
      topContributors,
    },
  };
};
