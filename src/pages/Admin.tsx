import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BlogPost } from '../types/blog.js';
import { blogPosts } from '../data/blogPosts.js';
import { Plus, Edit, Trash, Save, Mail, Check } from 'lucide-react';
import { db } from '../services/firestore.js';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  division: string;
  created_at: string;
  is_read: boolean;
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [contactEmail, setContactEmail] = useState(import.meta.env.VITE_CONTACT_EMAIL);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'blog' | 'messages' | 'settings'>('blog');

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'contact_messages'));
      const messagesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          message: data.message,
          division: data.division,
          created_at: data.created_at.toDate(),
          is_read: data.is_read,
        } as ContactMessage;
      });
      setMessages(messagesData);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const messageRef = doc(db, 'contact_messages', id);
      await updateDoc(messageRef, { is_read: true });
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Login</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === 'admin123') {
              setIsAuthenticated(true);
            }
          }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blog'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'blog' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
              <button
                onClick={() => setEditingPost({ 
                  id: '', 
                  title: '', 
                  excerpt: '', 
                  content: '', 
                  author: '',
                  date: new Date().toISOString().split('T')[0],
                  readTime: 5,
                  image: '',
                  tags: []
                })}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </button>
            </div>

            {/* Blog post editor and list */}
            {/* ... (existing blog post management code) ... */}
          </>
        )}

        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Contact Messages</h2>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-gray-800 p-6 rounded-lg ${
                    !message.is_read ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                      <p className="text-gray-400">{message.email}</p>
                      <p className="text-gray-400 text-sm">Division: {message.division}</p>
                    </div>
                    {!message.is_read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm inline-flex items-center"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">{message.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>
            <div className="max-w-xl">
              <div className="bg-gray-800 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Form Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={contactEmail}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
