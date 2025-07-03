import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation'

export default async function Home() {
  //@ts-expect-error NextAuth v4 compatibility issue with App Router types
  const session = await getServerSession(authOptions) ;
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white overflow-hidden">
      {/* Decorative Arc/Curve */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 z-0" width="1200" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,300 Q600,100 1200,300 L1200,400 L0,400 Z" fill="url(#arcGradient)" opacity="0.18" />
        <defs>
          <linearGradient id="arcGradient" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#43cea2" />
            <stop offset="1" stopColor="#185a9d" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Section */}
      <section className="relative w-full text-center py-32 px-4 z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] tracking-tight">
          Virtual Rhinoplasty Visualization
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
          Empower your journey with AI — visualize your rhinoplasty transformation before surgery. Upload your photo and see potential outcomes instantly.
        </p>
        <a href="/generate" className="inline-block bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white font-bold py-3 px-10 rounded-lg text-lg shadow-xl hover:from-[#185a9d] hover:to-[#43cea2] transition-colors border border-blue-200">
          Try It Now
        </a>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl py-16 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1: Easy Image Upload */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">Easy Image Upload</h3>
            <p className="text-[#0a2342]">
              Securely upload your profile images directly to the platform for analysis.
            </p>
          </div>
          {/* Feature Card 2: AI-Powered Simulation */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">AI-Powered Simulation</h3>
            <p className="text-[#0a2342]">
              Our advanced AI models generate realistic previews of your potential rhinoplasty results based on your preferences.
            </p>
          </div>
          {/* Feature Card 3: Explore Different Outcomes */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">Explore Different Outcomes</h3>
            <p className="text-[#0a2342]">
              Experiment with various nose shapes and styles using text prompts to find your desired look.
            </p>
          </div>
          {/* Feature Card 4: Confidential and Private */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">Confidential and Private</h3>
            <p className="text-[#0a2342]">
              Your images and simulations are kept secure and confidential.
            </p>
          </div>
          {/* Feature Card 5: Discuss with Your Surgeon */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">Discuss with Your Surgeon</h3>
            <p className="text-[#0a2342]">
              Use the generated images as a starting point for discussions with your surgeon.
            </p>
          </div>
          {/* Feature Card 6: Easy Access Anytime */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-[#185a9d]">Easy Access Anytime</h3>
            <p className="text-[#0a2342]">
              Access your uploaded images and generated simulations from anywhere, at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
