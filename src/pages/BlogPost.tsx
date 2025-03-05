import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog.js';
import { db } from '../services/firestore.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { toast } from 'react-hot-toast';

export function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, where('id', '==', postId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Post not found');
      }

      const data = querySnapshot.docs[0].data();
      const postData = {
        id: querySnapshot.docs[0].id,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        date: data.date.toDate(), // Assuming date is a Firestore Timestamp
        readTime: data.readTime,
        tags: data.tags,
        author: data.author,
      } as BlogPostType;
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16 flex items-center justify-center">
        <LoadingSpinner size={32} className="text-blue-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Post not found</h1>
          <Link 
            to="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-4">
        <Link 
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to blog
        </Link>

        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <time dateTime={post.date}>
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">
          {post.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-300 mb-4">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300">
            Written by <span className="font-semibold">{post.author}</span>
          </p>
        </div>
      </article>
    </div>
  );
}