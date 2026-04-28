'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { blogAPI } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  featuredImage?: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      setLoading(true);
      const response = await blogAPI.getPost(id);
      setPost(response.data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <article>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-blue-600 uppercase">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.author.email}</p>
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              {post.views} views
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

