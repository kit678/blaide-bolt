import React, { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard.js';
import { BlogPost } from '../types/blog.js';
import { db } from '../services/firestore.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { toast } from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blog_posts'));
      const postsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          image: data.image,
          date: data.date.toDate(), // Assuming date is a Firestore Timestamp
          readTime: data.readTime,
          tags: data.tags,
          author: data.author,
        } as BlogPost;
      });
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Latest Insights
          </h1>
          <p className="text-xl text-gray-300">
            Exploring the frontiers of AI innovation across our divisions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
