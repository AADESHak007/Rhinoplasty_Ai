"use client";

import { useState } from "react";
import Image from "next/image";

export default function GeneratePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(""); // Reset generated image URL

    try {
      // Step 1: Upload original image
      const formData = new FormData();
      formData.append("file", selectedImage);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      
      const { url: uploadedImageUrl, id: originalImageId } = await uploadResponse.json();
      setOriginalImageUrl(uploadedImageUrl);
      console.log("Original image uploaded:", { url: uploadedImageUrl, id: originalImageId });

      // Step 2: Generate AI image
      const generateResponse = await fetch("/api/generateImage/v1/stable3diffusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          prompt,
          originalImageId,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate image");
      }
      
      const { output: generatedImageUrl } = await generateResponse.json();
      console.log("AI generated image URL:", generatedImageUrl);

      // Step 3: Store AI generated image in database
      const storeResponse = await fetch("/api/store-generated-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: generatedImageUrl,
          originalImageId,
          prompt,
        }),
      });

      if (!storeResponse.ok) {
        throw new Error("Failed to store generated image");
      }

      const { url: storedImageUrl } = await storeResponse.json();
      console.log("Stored AI generated image:", storedImageUrl);
      
      // Set the generated image URL after successful storage
      setGeneratedImageUrl(storedImageUrl);

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Image Generator</h1>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {previewUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how you want to modify the image..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedImage || !prompt || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  !selectedImage || !prompt || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  "Generate Image"
                )}
              </button>
            </div>
          </div>
        </form>

        {(originalImageUrl || generatedImageUrl) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {originalImageUrl && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Original Image</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={originalImageUrl}
                    alt="Original"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Image</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={generatedImageUrl}
                    alt="Generated"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 