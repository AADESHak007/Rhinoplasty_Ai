"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Generation {
  id: string;
  originalImageUrl: string;
  aiImageUrl: string;
  createdAt: string;
  description?: string;
}

// Add a type for the raw data returned from the API
interface RawGeneration {
  id: string;
  originalImageUrl: string | null;
  aiImageUrl: string | null;
  createdAt: string | Date;
  description: string | null;
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenerations() {
      setLoading(true);
      try {
        const res = await fetch("/api/generations");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setGenerations(
          (data.generations || []).map((g: RawGeneration) => ({
            id: g.id,
            originalImageUrl: g.originalImageUrl || "",
            aiImageUrl: g.aiImageUrl || "",
            createdAt: typeof g.createdAt === "string" ? g.createdAt : new Date(g.createdAt).toISOString(),
            // description: g.description || undefined, // removed
          }))
        );
      } catch {
        setGenerations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGenerations();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd]">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Generations</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your previous rhinoplasty visualizations
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No generations found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {generations.map((generation) => (
              <div key={generation.id} className="bg-white rounded-xl shadow-lg px-4 sm:px-6 pt-4 pb-3 sm:pb-5 border border-slate-100">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-base font-semibold text-gray-800 mb-4">
                      Generated on {formatDate(generation.createdAt)}
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <button
                      className="ml-2 text-red-400 hover:text-red-600 p-1 rounded transition"
                      title="Delete"
                      // onClick={() => handleDelete(generation.id)}
                      disabled
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div> */}
                </div>
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-2 sm:mb-4">
                  <div className="flex flex-col items-center">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Original Photo</div>
                    <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                      {generation.originalImageUrl ? (
                        <Image src={generation.originalImageUrl} alt="Original" width={192} height={192} className="object-contain w-full h-full" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Generated Result</div>
                    <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                      {generation.aiImageUrl ? (
                        <Image src={generation.aiImageUrl} alt="Generated" width={192} height={192} className="object-contain w-full h-full" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Download buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    className="flex-1 border border-gray-200 rounded-lg py-2 flex items-center justify-center gap-2 font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
                    onClick={async () => {
                      const response = await fetch(generation.originalImageUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'original.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                    Download Original
                  </button>
                  <button
                    className="flex-1 border border-gray-200 rounded-lg py-2 flex items-center justify-center gap-2 font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
                    onClick={async () => {
                      const response = await fetch(generation.aiImageUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'result.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                    Download Result
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 