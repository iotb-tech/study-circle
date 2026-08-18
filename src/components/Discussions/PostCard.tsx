"use client"; 
 
import { useRouter } from "next/navigation"; 
import { Bookmark, MessageSquare, ThumbsUp } from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import useLocalStorage from "@/hooks/useLocalStorage"; 
 
interface PostCardProps { 
  post: { 
    id: string; 
    title: string; 
    body: string; 
    tags: string[]; 
    created_at: string; 
    profiles?: { 
      display_name: string | null; 
      avatar_url: string | null; 
    } | null; 
    comments_count?: Array<{ count: number }>; 
    votes_count?: Array<{ count: number }>; 
  }; 
  onTagClick?: (tag: string) => void; 
} 
 
export default function PostCard({ post, onTagClick }: PostCardProps) { 
  const router = useRouter(); 
  const displayName = post.profiles?.display_name || "Anonymous"; 
  const initials = displayName.charAt(0).toUpperCase(); 
  const truncatedBody = 
    post.body.length > 200 ? post.body.slice(0, 200) + "..." : post.body; 
 
  // Bookmark state using localStorage 
  const [bookmarks, setBookmarks] = useLocalStorage<typeof 
post[]>("bookmarks", []); 
  const isBookmarked = bookmarks.some((b) => b.id === post.id); 
 
  const toggleBookmark = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setBookmarks((prev) => 
      isBookmarked ? prev.filter((b) => b.id !== post.id) : [...prev, post] 
    ); 
  }; 
 
  return ( 
    <div 
      onClick={() => router.push(`/discussions/${post.id}`)} 
      className={cn( 
        "group relative cursor-pointer rounded-lg border border-primary-100 bg-primary-50/50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-primary-50", 
      )} 
    > 
      {/* Title */} 
      <h3 className="text-lg font-semibold text-neutral-900 
group-hover:text-primary-600 transition-colors line-clamp-2 mb-2"> 
        {post.title} 
      </h3> 
 
      {/* Body preview */} 
      <p className="text-sm text-neutral-600 line-clamp-3 mb-4"> 
        {truncatedBody} 
      </p> 
 
      {/* Tags */} 
      {post.tags && post.tags.length > 0 && ( 
        <div className="flex flex-wrap gap-2 mb-4"> 
          {post.tags.map((tag) => ( 
            <button 
              key={tag} 
              onClick={(e) => { 
                e.stopPropagation(); 
                onTagClick?.(tag); 
              }} 
              className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 
text-xs font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors 
cursor-pointer" 
            > 
              {tag} 
            </button> 
          ))} 
        </div> 
      )} 
 
      {/* Footer: Author, date, stats */} 
      <div className="flex items-center justify-between text-xs text-neutral-400 
border-t border-neutral-100 pt-3"> 
        <div className="flex items-center gap-2"> 
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center 
justify-center"> 
            <span className="text-xs font-medium text-primary-700"> 
              {initials} 
            </span> 
          </div> 
          <span className="text-neutral-600 font-medium">{displayName}</span> 
          <span>·</span> 
          <span>{new Date(post.created_at).toLocaleDateString()}</span> 
        </div> 
 
        <div className="flex items-center gap-3"> 
          <span className="flex items-center gap-1"> 
            <MessageSquare size={14} /> 
            {post.comments_count?.[0]?.count || 0} 
          </span> 
          <span className="flex items-center gap-1"> 
            <ThumbsUp size={14} /> 
            {post.votes_count?.[0]?.count || 0} 
          </span> 
          <button 
            onClick={toggleBookmark} 
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"} 
            title="Bookmark"
            className="flex items-center gap-1 text-neutral-400 transition-colors 
hover:text-primary-600" 
          > 
            <Bookmark 
              size={14} 
              className={isBookmarked ? "fill-primary-500 text-primary-500" : ""} 
            /> 
          </button> 
        </div> 
      </div> 
    </div> 
  ); 
} 
