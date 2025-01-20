import { format } from 'date-fns';
import { Clock, Tag } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:-translate-y-1 transition-all">
      <Link to={`/blog/${post.id}`}>
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMM d, yyyy')}
            </time>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
          <p className="text-gray-300 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}