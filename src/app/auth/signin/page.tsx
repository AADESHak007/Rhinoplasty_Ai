'use client';

import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/app/utils/actions";
import { useState, useEffect } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  // Add controlled state for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Clear form when switching modes
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-blue-100 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#185a9d] tracking-wide">
          {isSignUp ? 'Create an account' : 'Welcome to Rhinoplasty AI'}
        </h1>
        
        <AuthMessages searchParams={searchParams} isSignUp={isSignUp} toggleMode={toggleMode} />

        {/* Google Sign In */}
        <form className="w-full mb-6">
          <button
            formAction={signInWithGoogle}
            className="w-full bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#43cea2] flex items-center justify-center space-x-2 shadow-md"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="relative mb-6 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/95 px-2 text-[#185a9d] font-semibold">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4 w-full">
          {/* Name field - only show for sign up */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                required
                className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
                placeholder="Your full name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
              className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
              placeholder="Email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#185a9d] mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              className="w-full px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2]"
              placeholder="Password"
            />
          </div>

          {/* Single button based on mode */}
          <button
            formAction={isSignUp ? signUpWithEmail : signInWithEmail}
            className="w-full bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] text-white py-2 px-4 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#43cea2] shadow-md"
          >
            {isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#185a9d]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="font-semibold text-[#43cea2] hover:text-[#185a9d] transition-colors underline focus:outline-none"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper component to handle async searchParams
function AuthMessages({ 
  searchParams, 
  isSignUp, 
  toggleMode 
}: { 
  searchParams: Promise<{ message?: string; error?: string }>;
  isSignUp: boolean;
  toggleMode: () => void;
}) {
  const [params, setParams] = useState<{ message?: string; error?: string }>({});

  // Use useEffect to resolve the promise
  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  const showSignUpSuggestion = params?.error && 
    (params.error.includes("Don't have an account") || 
     params.error.includes("Sign up instead") ||
     params.error.includes("No account found"));
     
  const showSignInSuggestion = params?.error && 
    (params.error.includes("already exists") || 
     params.error.includes("Please sign in instead"));

  return (
    <>
      {params?.message && (
        <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
          {params.message}
        </div>
      )}
      
      {params?.error && (
        <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          <div className="text-center">{params.error}</div>
                     {showSignUpSuggestion && !isSignUp && (
             <div className="mt-3 text-center">
               <button
                 onClick={toggleMode}
                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors"
               >
                 Create an account instead
               </button>
             </div>
           )}
           {showSignInSuggestion && isSignUp && (
             <div className="mt-3 text-center">
               <button
                 onClick={toggleMode}
                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors"
               >
                 Sign in instead
               </button>
             </div>
           )}
        </div>
      )}
    </>
  );
} 

