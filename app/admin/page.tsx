'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminAPI, userAPI, blogAPI, eventsAPI, galleryAPI, contactAPI } from '@/lib/api';

interface DashboardStats {
  users: { total: number };
  posts: { total: number; published: number; draft: number };
  events: { total: number; published: number; draft: number };
  galleries: { total: number };
  contacts: { total: number; pending: number };
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Blog Posts</h3>
              <p className="text-3xl font-bold text-green-600">{stats.posts.total}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.posts.published} published, {stats.posts.draft} draft
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Events</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.events.total}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.events.published} published, {stats.events.draft} draft
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Messages</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.contacts.total}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.contacts.pending} pending</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href="/blog"
                className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
              >
                Manage Blog Posts
              </a>
              <a
                href="/events"
                className="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
              >
                Manage Events
              </a>
              <a
                href="/gallery"
                className="block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center"
              >
                Manage Gallery
              </a>
              <a
                href="/contact"
                className="block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-center"
              >
                View Messages
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
            <p className="text-gray-600">
              Manage all content on the platform including blog posts, events, gallery, and user messages.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600">
              View and manage users, assign roles, and monitor platform activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

