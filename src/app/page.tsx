import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions) ;
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full text-center py-20 px-4 overflow-hidden">
         {/* Background glowing effect - Placeholder */}
         <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center top, rgba(128, 0, 128, 0.2), transparent 50%)' }}></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-400 drop-shadow-lg">
            Visualize Your Rhinoplasty Transformation <br className="hidden md:inline" /> with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Upload your photo and see potential outcomes of your nose surgery before committing.
          </p>
          {/* Call to Action Button */}
          <a href="/generate" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-md text-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
            Try It Now
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl py-16 px-4 relative z-10">
         {/* Background glowing effect - Placeholder */}
         <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center bottom, rgba(128, 0, 128, 0.1), transparent 50%)' }}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1: Easy Image Upload */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Easy Image Upload</h3>
            <p className="text-gray-400">
              Securely upload your profile images directly to the platform for analysis.
            </p>
          </div>

          {/* Feature Card 2: AI-Powered Simulation */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">AI-Powered Simulation</h3>
            <p className="text-gray-400">
              Our advanced AI models generate realistic previews of your potential rhinoplasty results based on your preferences.
            </p>
          </div>

          {/* Feature Card 3: Explore Different Outcomes */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Explore Different Outcomes</h3>
            <p className="text-gray-400">
              Experiment with various nose shapes and styles using text prompts to find your desired look.
            </p>
          </div>

           {/* Feature Card 4: Confidential and Private */}
           <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Confidential and Private</h3>
            <p className="text-gray-400">
              Your images and simulations are kept secure and confidential.
            </p>
          </div>

           {/* Feature Card 5: Discuss with Your Surgeon */}
           <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Discuss with Your Surgeon</h3>
            <p className="text-gray-400">
              Use the generated images as a starting point for discussions with your surgeon.
            </p>
          </div>

           {/* Feature Card 6: Easy Access Anytime */}
           <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 hover:border-purple-600 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Easy Access Anytime</h3>
            <p className="text-gray-400">
              Access your uploaded images and generated simulations from anywhere, at any time.
            </p>
          </div>

        </div>
      </section>

      {/* Add more sections as needed */}

    </div>
  );
}
