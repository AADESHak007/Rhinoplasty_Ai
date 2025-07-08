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
            description: g.description || undefined,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Generations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
          <div className="grid gap-6">
            {generations.map((generation) => (
              <div key={generation.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-white">
                <div className="flex justify-between items-start p-6 border-b">
                  <div>
                    <div className="text-lg font-bold">
                      Generated on {formatDate(generation.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-3">Original Photo</p>
                    <Image
                      src={generation.originalImageUrl || "/placeholder.svg"}
                      alt="Original"
                      width={250}
                      height={250}
                      className="mx-auto rounded-lg object-cover border shadow-sm"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-3">Generated Result</p>
                    <Image
                      src={generation.aiImageUrl || "/placeholder.svg"}
                      alt="Generated"
                      width={250}
                      height={250}
                      className="mx-auto rounded-lg object-cover border shadow-sm"
                    />
                  </div>
                </div>
                {generation.description && (
                  <div className="px-6 pb-4">
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                      <p className="text-sm text-gray-600">{generation.description}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 px-6 pb-6">
                  <button
                    className="flex-1 bg-transparent border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50"
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
                    Download Original
                  </button>
                  <button
                    className="flex-1 bg-transparent border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-50"
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