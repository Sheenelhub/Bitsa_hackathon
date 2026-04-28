'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogAPI } from '@/lib/api';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    email: string;
  };
  featuredImage?: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params: any = { published: true };
      if (category !== 'all') {
        params.category = category;
      }
      const response = await blogAPI.getPosts(params);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Blog</h1>
          <p className="mt-4 text-xl text-gray-600">Stay updated with the latest news and announcements</p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-md ${
              category === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory('article')}
            className={`px-4 py-2 rounded-md ${
              category === 'article' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setCategory('announcement')}
            className={`px-4 py-2 rounded-md ${
              category === 'announcement' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setCategory('update')}
            className={`px-4 py-2 rounded-md ${
              category === 'update' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Updates
          </button>
        </div>

        {loading ? (
          <div className="mt-12 text-center">Loading...</div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 uppercase">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author.name}</span>
                      <span className="text-sm text-gray-500">{post.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="mt-12 text-center text-gray-500">No posts found.</div>
        )}
      </div>
    </div>
  );
}

