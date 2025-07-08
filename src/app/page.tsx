"use client";

import Link from "next/link";
export default function Home() {


  return (
    <div className="bg-[#f8fbff] min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-24 px-4 text-center bg-[#f8fbff]">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">AI-Powered Rhinoplasty Visualization</span>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#181c2a] tracking-tight">
          Visualize Your Perfect <span className="text-[#7b5cff]">Nose Shape</span>
        </h1>
        <p className="text-lg md:text-2xl text-[#4b5563] mb-10 max-w-2xl mx-auto">
          Experience the future of rhinoplasty consultation with our advanced AI technology. Upload your photo and see realistic previews of different nose shapes instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate" className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#7b5cff] to-[#6ee7b7] text-white font-bold text-lg shadow-lg hover:from-[#6ee7b7] hover:to-[#7b5cff] transition-colors">Start Visualization<span className="ml-2">→</span></Link>
          <Link href="#how-it-works" className="px-8 py-4 rounded-lg bg-white border border-gray-200 text-[#181c2a] font-bold text-lg shadow hover:bg-gray-50 transition-colors">Learn More</Link>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full py-20 px-4 bg-white">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-[#181c2a]">Why Choose RHINOPLASTY-AI?</h2>
        <p className="text-center text-lg text-[#4b5563] mb-14 max-w-2xl mx-auto">Our cutting-edge AI technology provides accurate, realistic previews to help you make informed decisions.</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 4v24M4 16h24" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
            <h3 className="text-xl font-bold mb-2 text-[#181c2a]">Instant Results</h3>
            <p className="text-[#4b5563] text-center">Get realistic rhinoplasty previews in seconds with our advanced AI processing technology.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="3"/><path d="M16 10v6l4 2" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
            <h3 className="text-xl font-bold mb-2 text-[#181c2a]">Secure & Private</h3>
            <p className="text-[#4b5563] text-center">Your photos are processed securely and never stored permanently. Complete privacy guaranteed.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="3"/><path d="M16 10v6l4 2" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
            <h3 className="text-xl font-bold mb-2 text-[#181c2a]">Expert Approved</h3>
            <p className="text-[#4b5563] text-center">Developed in collaboration with leading plastic surgeons for medically accurate results.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 px-4 bg-[#f8fbff]">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-[#181c2a]">How It Works</h2>
        <p className="text-center text-lg text-[#4b5563] mb-14 max-w-2xl mx-auto">Simple steps to visualize your perfect nose shape</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-3xl font-bold mb-4">1</span>
            <h4 className="text-xl font-bold mb-2 text-[#181c2a]">Upload Your Photo</h4>
            <p className="text-[#4b5563] text-center">Upload a clear front or side view photo of your face for the best results.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-3xl font-bold mb-4">2</span>
            <h4 className="text-xl font-bold mb-2 text-[#181c2a]">Choose Your Style</h4>
            <p className="text-[#4b5563] text-center">Select from various nose shapes or describe your ideal look with a custom prompt.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7] text-white text-3xl font-bold mb-4">3</span>
            <h4 className="text-xl font-bold mb-2 text-[#181c2a]">See Results</h4>
            <p className="text-[#4b5563] text-center">View your realistic preview instantly and save it to your personal gallery.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-r from-[#2563eb] to-[#7b5cff] text-white text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to See Your Future Look?</h2>
        <p className="text-lg mb-8">Join thousands who have already discovered their perfect nose shape with RHINOPLASTY-AI.</p>
        <Link href="/generate" className="px-8 py-4 rounded-lg bg-white text-[#7b5cff] font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors">Start Your Visualization<span className="ml-2">→</span></Link>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-[#181c2a] text-white flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b5cff] to-[#6ee7b7]">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#fff"/></svg>
          </span>
          <span className="font-bold text-lg">RHINOPLASTY-AI</span>
        </div>
        <span className="text-sm">© 2025 RHINOPLASTY-AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
