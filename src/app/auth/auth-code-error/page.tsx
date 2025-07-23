import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-red-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-4 text-red-600">
          Email Confirmation Failed
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          There was an error confirming your email address. The confirmation link may have expired or is invalid.
        </p>
        
        <div className="space-y-3 w-full">
          <Link 
            href="/auth/signin"
            className="w-full bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#43cea2] flex items-center justify-center shadow-md"
          >
            Try Signing In Again
          </Link>
          
          <Link 
            href="/"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center shadow-md"
          >
            Go Home
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          If you continue to have issues, please contact support.
        </p>
      </div>
    </div>
  )
} 