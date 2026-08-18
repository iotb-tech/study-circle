import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  // We use Promise.all to fetch everything in PARALLEL
  // This means all 10 queries start at the same time
  // Instead of waiting for each one sequentially (which would be slower)
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
    // Count ALL posts in the system
    supabase.from("posts").select("id", { count: "exact", head: true }),

    // Count posts by THIS user (using userId from auth)
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    // Count ALL comments
    supabase.from("comments").select("id", { count: "exact", head: true }),

    // Count comments by THIS user
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    // Count ALL votes
    supabase.from("votes").select("id", { count: "exact", head: true }),

    // Count votes by THIS user
    supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    // Get all post creation dates (for line chart)
    supabase
      .from("posts")
      .select("created_at")
      .order("created_at", { ascending: true }),

    // Get all tags from all posts (for tag analysis)
    supabase.from("posts").select("tags"),

    // Get all comments (for engagement count)
    supabase.from("comments").select("created_at"),

    // Get all posts with user info (for top contributors)
    supabase
      .from("posts")
      .select("user_id, profiles(display_name)")
      .order("created_at", { ascending: false }),
  ]);

  // Process the raw data into chart-friendly format
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

  // Return everything organized
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
}

// Helper function: Group posts by creation date
function processPostsOverTime(
  posts: Array<{ created_at: string }>,
  comments: Array<{ created_at?: string }>,
) {
  const grouped = new Map<
    string,
    { date: string; posts: number; comments: number; votes: number }
  >();

  // Process posts
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

  // Process comments
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

// Helper function: Count how many times each tag is used
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
    .slice(0, 8); // Top 8 tags
}

// Helper function: Count posts per user
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
