'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

