import CreatePostForm from "@/components/Discussions/CreatePostForm";
import useDebounce from "@/hooks/useDebounce";
import useLocalStorage from "@/hooks/useLocalStorage";
import usePagination from "@/hooks/usePagination";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  comments_count: Array<{ count: number }>;
  votes_count: Array<{ count: number }>;
}

export default function DiscussionsPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    "discussions-search",
    "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (display_name, avatar_url),
        comments_count:comments(count),
        votes_count:votes(count)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) => post.tags?.includes(tag)),
      );
    }

    return filtered;
  }, [posts, debouncedSearchQuery, selectedTags]);

  const pagination = usePagination(filteredPosts, { pageSize: 6 });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Discussions</h1>
      <CreatePostForm />
    </div>
  );
}
