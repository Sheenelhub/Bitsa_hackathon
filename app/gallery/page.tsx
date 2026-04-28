'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { galleryAPI } from '@/lib/api';
import { format } from 'date-fns';

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  event?: {
    title: string;
    date: string;
  };
  uploadedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getGalleries({ published: true });
      setGalleries(response.data.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Gallery</h1>
          <p className="mt-4 text-xl text-gray-600">Browse photos from past events and memorable moments</p>
        </div>

        {loading ? (
          <div className="mt-12 text-center">Loading...</div>
        ) : (
          <div className="mt-12 space-y-12">
            {galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{gallery.title}</h2>
                      {gallery.description && (
                        <p className="mt-2 text-gray-600">{gallery.description}</p>
                      )}
                      {gallery.event && (
                        <p className="mt-1 text-sm text-gray-500">
                          Event: {gallery.event.title} - {format(new Date(gallery.event.date), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(gallery.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.images.slice(0, 8).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedGallery(gallery)}
                      >
                        <img
                          src={image}
                          alt={`${gallery.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {gallery.images.length > 8 && (
                    <button
                      onClick={() => setSelectedGallery(gallery)}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all {gallery.images.length} photos →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && galleries.length === 0 && (
          <div className="mt-12 text-center text-gray-500">No galleries found.</div>
        )}
      </div>

      {selectedGallery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedGallery(null)}
        >
          <div className="max-w-6xl w-full max-h-full overflow-auto">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedGallery.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedGallery.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedGallery.title} - Image ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

