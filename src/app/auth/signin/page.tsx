'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      name,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/'); // Redirect to home page on successful sign-in
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/',
      });
      
      if (result?.error) {
        setError('Google sign-in failed. Please try again.');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-blue-100 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#185a9d] tracking-wide">Sign In</h1>
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mb-6 bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#43cea2] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>
        <div className="relative mb-6 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/95 px-2 text-[#185a9d] font-semibold">Or continue with email</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 rounded-md text-red-700 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] text-white py-2 px-4 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#43cea2] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              'Sign in with Credentials'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 