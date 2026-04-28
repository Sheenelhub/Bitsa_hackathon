'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [upcoming]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents({ published: true, upcoming });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }

    try {
      await eventsAPI.registerForEvent(eventId);
      alert('Successfully registered for event!');
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Events</h1>
          <p className="mt-4 text-xl text-gray-600">Discover upcoming BITSA activities and programs</p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setUpcoming(true)}
            className={`px-4 py-2 rounded-md ${
              upcoming ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setUpcoming(false)}
            className={`px-4 py-2 rounded-md ${
              !upcoming ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Events
          </button>
        </div>

        {loading ? (
          <div className="mt-12 text-center">Loading...</div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  {event.registrationRequired && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {event.registeredUsers.length} registered
                        {event.maxParticipants && ` / ${event.maxParticipants} max`}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                    {event.registrationRequired && user && (
                      <button
                        onClick={() => handleRegister(event._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="mt-12 text-center text-gray-500">No events found.</div>
        )}
      </div>
    </div>
  );
}

