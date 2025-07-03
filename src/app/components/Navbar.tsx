"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Logo from '../../../public/rhinoplasty-ai-updated.png'
import Image from 'next/image'

const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/generate', label: 'Generate' },
    // { href: '/uploadImage', label: 'Upload Image' },
  ]

  return (
    <nav className="w-full top-0 left-0 z-50 sticky bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-opacity-95 shadow-lg border-b border-blue-400/30 backdrop-blur-md px-8 py-0 flex items-center justify-between h-20">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity h-full">
        <div className="relative flex items-center h-full">
          <Image 
            src={Logo} 
            alt="RhinoPlasty AI Logo" 
            width={56} 
            height={56} 
            className="object-contain rounded-full border-2 border-blue-300 shadow-md bg-white h-14 w-14"
            priority
          />
        </div>
        <span className="text-2xl md:text-3xl font-extrabold text-blue-100 tracking-wide whitespace-nowrap">
          RHINOPLASTY-AI
        </span>
      </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 items-center">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors text-lg px-3 py-1 rounded-md font-semibold ${
                pathname === link.href
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Authentication Section */}
      <div className="flex items-center space-x-2 md:space-x-4 text-white">
        {status === "loading" ? (
          <div className="text-blue-200 text-sm">Loading...</div>
        ) : session ? (
          <>
            {/* User Info - Hidden on mobile */}
            <div className="hidden lg:block text-white text-sm font-semibold">
              Welcome, <span className="text-white text-lg font-semibold">{session.user?.name || session.user?.email}</span>
            </div>
            {/* Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-2 px-4 rounded-md transition-colors font-semibold text-sm shadow-md border border-red-400/40"
            >
              Logout
            </button>
          </>
        ) : (
          /* Login Link */
          <Link href="/auth/signin" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md transition-colors font-semibold text-sm shadow-md border border-purple-400/40">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar