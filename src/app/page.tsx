"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);


  return (
    <div className="bg-[#f8fbff] min-h-screen flex flex-col">
      
      {/* Success Message */}
      {message && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 text-center">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <span>{message}</span>
            <button 
              onClick={() => setMessage(null)} 
              className="ml-4 text-green-700 hover:text-green-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-12 sm:py-16 lg:py-24 px-3 sm:px-4 text-center bg-[#f8fbff]">
        <span className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs sm:text-sm">AI-Powered Rhinoplasty Visualization</span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 text-[#181c2a] tracking-tight px-2">
          Visualize Your Perfect <span className="text-[#7b5cff]">Nose Shape</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#4b5563] mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-3">
          Experience the future of rhinoplasty consultation with our advanced AI technology. Upload your photo and see realistic previews of different nose shapes instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md sm:max-w-none px-3">
          <Link href="/generate" className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-[#7b5cff] to-[#6ee7b7] text-white font-bold text-base sm:text-lg shadow-lg hover:from-[#6ee7b7] hover:to-[#7b5cff] transition-colors">Start Visualization<span className="ml-2">→</span></Link>
          <Link href="#how-it-works" className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 text-[#181c2a] font-bold text-base sm:text-lg shadow hover:bg-gray-50 transition-colors">Learn More</Link>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-[#181c2a]">Why Choose RHINOPLASTY-AI?</h2>
        <p className="text-center text-sm sm:text-base lg:text-lg text-[#4b5563] mb-8 sm:mb-12 lg:mb-14 max-w-2xl mx-auto px-3">Our cutting-edge AI technology provides accurate, realistic previews to help you make informed decisions.</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-gray-100">
            <span className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6 lucide lucide-image-up-icon lucide-image-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">Instant Results</h3>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">Get realistic rhinoplasty previews in seconds with our advanced AI processing technology.</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-gray-100">
            <span className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6 lucide lucide-globe-lock-icon lucide-globe-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13"/><path d="M2 12h8.5"/><path d="M20 6V4a2 2 0 1 0-4 0v2"/><rect width="8" height="5" x="14" y="6" rx="1"/></svg>
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">Secure & Private</h3>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">Your photos are processed securely and never stored permanently. Complete privacy guaranteed.</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-gray-100">
            <span className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-3 sm:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6 lucide lucide-pen-line-icon lucide-pen-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">Expert Approved</h3>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">Developed in collaboration with leading plastic surgeons for medically accurate results.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-[#f8fbff]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-[#181c2a]">How It Works</h2>
        <p className="text-center text-sm sm:text-base lg:text-lg text-[#4b5563] mb-8 sm:mb-12 lg:mb-14 max-w-2xl mx-auto px-3">Simple steps to visualize your perfect nose shape</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">1</span>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">Upload Your Photo</h4>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">Upload a clear front or side view photo of your face for the best results.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">2</span>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">Choose Your Style</h4>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">Select from various nose shapes or describe your ideal look with a custom prompt.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">3</span>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-[#181c2a] text-center">See Results</h4>
            <p className="text-[#4b5563] text-center text-sm sm:text-base">View your realistic preview instantly and save it to your personal gallery.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-r from-[#2563eb] to-[#7b5cff] text-white text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4">Ready to See Your Future Look?</h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 px-3">Join thousands who have already discovered their perfect nose shape with RHINOPLASTY-AI.</p>
        <Link href="/generate" className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-white text-[#7b5cff] font-bold text-base sm:text-lg shadow-lg hover:bg-gray-100 transition-colors">Start Your Visualization<span className="ml-2">→</span></Link>
      </section>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-6 bg-[#181c2a] text-white flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7]">
            <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#fff"/></svg>
          </span>
          <span className="font-bold text-sm sm:text-lg">RHINOPLASTY-AI</span>
        </div>
        <span className="text-xs sm:text-sm text-center sm:text-left">© 2025 RHINOPLASTY-AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
