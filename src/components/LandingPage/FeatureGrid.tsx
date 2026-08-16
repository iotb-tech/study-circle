import { FileSearch, MessageCircleQuestion, ArrowBigUp, MessageSquare, BadgeCheck, LucideIcon 
} from 'lucide-react'; 
import Card from '../ui/Card' 
 
const features: { icon: LucideIcon; title: string; description: string }[] = [ 
  { 
    icon: FileSearch, 
    title: 'Search by keyword or tag', 
    description: 'Find an answer in seconds instead of scrolling weeks of chat history', 
  }, 
  { 
    icon: MessageCircleQuestion, 
    title: 'Ask a question', 
    description: 'Post with a title, full detail, and tags - no more losing context to a one line message', 
  }, 
  { 
    icon: MessageSquare, 
    title: 'Comment threads', 
    description: 'Follow up questions and clarifications; stay attached to the original post', 
  }, 
  { 
    icon: ArrowBigUp, 
    title: 'Upvotes', 
    description: 'The best answer rises to the top, so future fellows see it first', 
  }, 
  { 
    icon: BadgeCheck, 
    title: 'Mentor-verified answers', 
    description: 'A trusted checkmark so you know an answer is right, not just popular', 
  }, 
]; 
 
export default function FeaturesGrid() { 
  return ( 
    <section className="py-16"> 
      <div className=" mx-auto max-w-7xl px-4 bg-primary-300"> 
        <h2 className="mt-12 text-center text-3xl font-bold text-neutral-900"> 
          Everything you need to stop repeating yourself... 
        </h2> 
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
gap-6 justify-center"> 
          {features.map((feature, index) => ( 
            <Card key={index} className="p-6 text-center hover:shadow-lg 
transition-shadow bg-neutral-200 mb-4"> 
              <feature.icon 
                className="mx-auto h-12 w-12 text-primary-500" 
                aria-hidden="true" 
              /> 
              <h3 className="mt-4 text-xl font-semibold text-neutral-900"> 
                {feature.title} 
              </h3> 
              <p className="mt-2 text-neutral-600">{feature.description}</p> 
            </Card> 
          ))} 
        </div> 
      </div> 
    </section> 
  ); 
}