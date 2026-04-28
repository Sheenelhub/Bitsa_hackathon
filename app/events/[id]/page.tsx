'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eventsAPI } from '@/lib/api';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  category: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  registeredUsers: any[];
  organizer: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (id: string) => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvent(id);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      alert('Please login to register for events');
      router.push('/auth/login');
      return;
    }

    if (!event) return;

    try {
      setRegistering(true);
      await eventsAPI.registerForEvent(event._id);
      alert('Successfully registered for event!');
      fetchEvent(event._id);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  const isRegistered = user && event.registeredUsers.some((u: any) => u._id === user.id);

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Events
        </button>

        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-blue-600 uppercase">
            {event.category}
          </span>
          <span className="text-sm text-gray-500">
            {format(new Date(event.date), 'MMMM d, yyyy • h:mm a')}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {event.organizer.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Organized by {event.organizer.name}</p>
              <p className="text-sm text-gray-500">{event.organizer.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>

        <div className="prose max-w-none mb-8">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {event.description}
          </div>
        </div>

        {event.registrationRequired && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Required</h3>
            <p className="text-gray-600 mb-4">
              {event.registeredUsers.length} registered
              {event.maxParticipants && ` / ${event.maxParticipants} max participants`}
            </p>
            {user ? (
              isRegistered ? (
                <p className="text-green-600 font-medium">You are registered for this event</p>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? 'Registering...' : 'Register for Event'}
                </button>
              )
            ) : (
              <p className="text-gray-600">
                Please <a href="/auth/login" className="text-blue-600 hover:text-blue-800">login</a> to register for this event
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

