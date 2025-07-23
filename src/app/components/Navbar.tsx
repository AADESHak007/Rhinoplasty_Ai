"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { signOut } from '@/app/utils/actions';
import type { User } from '@supabase/supabase-js';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Generate', href: '/generate' },
  { name: 'History', href: '/history' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const userName = user?.user_metadata?.full_name || user?.email || '';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
        <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
          <Image src="/Screenshot 2025-07-09 203743.png" alt="logo" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
          <span className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition">RHINOPLASTY-AI</span>
        </Link>
        
        {/* Desktop Navigation - Fixed Center */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 lg:gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={`font-medium px-2 py-1 rounded transition-colors ${pathname === link.href ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-700 hover:text-blue-600'}`}>{link.name}</Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto">
          {loading ? null : user ? (
            <>
              <span className="hidden lg:inline text-gray-700 font-semibold text-sm">Welcome, {userName}</span>
              <button
                onClick={handleSignOut}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition text-sm"
              >
                Logout
              </button>
            </>
                      ) : (
              <>
              <button
               onClick={() => router.push('/auth/signin')}
               className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition text-sm"
               >
              Login
            </button>
              </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Open navigation menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-gray-200 bg-white text-blue-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium px-3 py-2 rounded-lg transition-colors ${pathname === link.href ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-3">
              {loading ? (
                <div className="px-3 py-2 text-gray-500">Loading...</div>
              ) : user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700 font-semibold mb-2">Welcome, {userName}</div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full px-3 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition text-sm"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}