'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessMessageContent() {
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

  if (!message) return null;

  return (
    <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3">
      <div className="flex justify-center gap-4 items-center max-w-4xl mx-auto">
        <span>{message}</span>
        <button 
          onClick={() => setMessage(null)} 
          className="ml-4 text-green-700 hover:text-green-900 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function SuccessMessage() {
  return (
    <Suspense fallback={null}>
      <SuccessMessageContent />
    </Suspense>
  );
} 