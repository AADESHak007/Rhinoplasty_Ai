"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/generate', label: 'Generate' },
    { href: '/uploadImage', label: 'Upload Image' },
  ]

  return (
    <nav className="bg-black bg-opacity-50 backdrop-blur-lg text-white px-4 py-3 fixed top-0 left-0 w-full z-50 shadow-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl md:text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
          {/* Placeholder for logo */}
          {/* <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
            <span className="text-sm font-bold">AI</span>
          </div> */}
          RhinoPlasty AI
        </Link>

        {/* Navigation Links - Hidden on mobile, visible on md+ */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-purple-400 transition-colors text-lg ${
                  pathname === link.href ? 'text-purple-500 font-semibold' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {status === "loading" ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : session ? (
            <>
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-gray-300 text-sm">
                Welcome, <span className="text-purple-400 font-semibold">{session.user?.name || session.user?.email}</span>
              </div>
              {/* Logout Button */}
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 md:px-4 rounded-md transition-colors font-semibold text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            /* Login Link */
            <Link href="/auth/signin" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 md:px-4 rounded-md transition-colors font-semibold text-sm">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Shown below main navbar on mobile */}
      <div className="md:hidden mt-3 pt-3 border-t border-gray-700">
        <ul className="flex justify-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-purple-400 transition-colors text-sm ${
                  pathname === link.href ? 'text-purple-500 font-semibold' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar