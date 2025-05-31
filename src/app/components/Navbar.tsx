"use client"
import { signOut } from 'next-auth/react'
import React from 'react'

const Navbar = () => {

  return (
    <div className='bg-zinc-800 w-full h-12 p-2 text-black font-semibold'>
        <nav className='flex justify-between items-center'>
            <div className='text-lg text-amber-700'>Rhinoplasty AI</div>
            <div className='flex space-x-4 justify-center items-center'>
            <a href="/" className='hover:text-blue-500 text-zinc-400'>Home</a>
            <a href="/about" className='hover:text-blue-500 text-zinc-400'>About</a>
            <a href="/contact" className='hover:text-blue-500 text-zinc-400'>Contact</a>
            <button onClick={()=> signOut({ callbackUrl: '/api/auth/signin' })} className='bg-red-500 text-zinc-200 px-3 py-1 rounded hover:bg-red-600'>
                Logout
            </button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar