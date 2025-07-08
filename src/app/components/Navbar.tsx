"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Generate', href: '/generate' },
  { name: 'History', href: '/history' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userName = session?.user?.name || session?.user?.email || '';
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/rhinoplasty-ai-logo.png" alt="logo" width={36} height={36} className="rounded-lg" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition">RHINOPLASTY-AI</span>
        </Link>
        <div className="flex-1 flex justify-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={`font-medium px-2 py-1 rounded transition-colors ${pathname === link.href ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-700 hover:text-blue-600'}`}>{link.name}</Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {status === 'loading' ? null : session ? (
            <>
              <span className="hidden md:inline text-gray-700 font-semibold">Welcome, {userName}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-5 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow hover:from-blue-700 hover:to-purple-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}