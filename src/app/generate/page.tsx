"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// Predefined nose type prompts
const RHINOPLASTY_OPTIONS = {
  roman: {
    label: "Roman Nose",
    prompt: "Transform only the nose to a Roman nose style with a prominent straight bridge and slight downward curve at the tip, keep everything else exactly the same: same eyes, same mouth, same face shape, same skin, same hair, same lighting, same background - change only the nose to Roman type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  nubian: {
    label: "Nubian Nose",
    prompt: "Modify only the nose to a Nubian nose shape with a wide base and flared nostrils, preserve everything else identical: same eyes, same eyebrows, same lips, same facial structure, same skin tone, same hair, same lighting - alter only the nose to Nubian style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  greek: {
    label: "Greek/Straight Nose",
    prompt: "Change only the nose to a Greek nose with a perfectly straight bridge from forehead to tip, maintain all other features unchanged: same eye shape, same mouth, same cheeks, same jawline, same skin, same hair, same background - modify only the nose to Greek/straight type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  button: {
    label: "Button/Celestial Nose",
    prompt: "Transform only the nose to a button nose shape - small, upturned with a slight curve, keep everything else identical: same face structure, same eyes, same lips, same skin color, same hair style, same lighting - change only the nose to button/celestial style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  aquiline: {
    label: "Aquiline/Hooked Nose",
    prompt: "Modify only the nose to an aquiline nose with a prominent curved bridge forming a hook shape, preserve all other facial features: same eyes, same mouth, same face shape, same skin tone, same hair, same expression - alter only the nose to aquiline type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  snub: {
    label: "Snub Nose",
    prompt: "Change only the nose to a snub nose - short, turned up at the tip with visible nostrils, maintain everything else unchanged: same eye color and shape, same lips, same facial proportions, same skin, same hair, same lighting - modify only the nose to snub style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  bulbous: {
    label: "Bulbous Nose",
    prompt: "Transform only the nose to have a bulbous tip - rounded and enlarged at the end, keep all other features identical: same eyes, same eyebrows, same mouth shape, same cheeks, same chin, same skin, same hair - change only the nose tip to bulbous style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  hawk: {
    label: "Hawk Nose",
    prompt: "Modify only the nose to a hawk nose shape with a sharp, prominent bridge and narrow tip, preserve everything else exactly: same facial structure, same eyes, same lips, same skin tone, same hair color, same background - alter only the nose to hawk type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  upturned: {
    label: "Upturned Nose",
    prompt: "Change only the nose to an upturned nose with an upward-pointing tip and visible nostrils, retain all other facial details the same: same eyes, same mouth, same skin tone, same hair style, same lighting, same background - modify only the nose to upturned type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  flat: {
    label: "Flat Nose",
    prompt: "Transform only the nose to a flat nose with a low bridge and minimal projection, especially at the nasal tip, keep all other features identical: same eyes, same lips, same facial symmetry, same hair, same skin tone, same lighting - change only the nose to flat type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  hooked: {
    label: "Hooked Nose",
    prompt: "Modify only the nose to a hooked nose with a pronounced downward curve in the bridge, maintain everything else unchanged: same face structure, same eye shape, same lips, same cheeks, same lighting - alter only the nose to hooked type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  wide: {
    label: "Wide Nose",
    prompt: "Change only the nose to a wide nose shape with a broad bridge and flared nostrils, preserve all other facial characteristics: same eyes, same lips, same hair, same skin tone, same lighting, same background - modify only the nose to wide type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  narrow: {
    label: "Narrow Nose",
    prompt: "Transform only the nose to a narrow nose with a slim bridge and petite tip, keep all other details untouched: same eye shape and color, same lips, same facial shape, same skin, same hair, same lighting - change only the nose to narrow type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};


export default function GeneratePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("roman");
  const [customPrompt, setCustomPrompt] = useState("");
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
    if (!selectedImage) return;

    // Use custom prompt if selected, otherwise use preset prompt
    const finalPrompt = selectedOption === "custom" ? customPrompt : RHINOPLASTY_OPTIONS[selectedOption as keyof typeof RHINOPLASTY_OPTIONS].prompt;
    
    if (!finalPrompt) {
      setError("Please provide a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl("");

    try {
      // Step 1: Upload original image to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedImage);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      
      const { url: uploadedImageUrl } = await uploadResponse.json();
      setOriginalImageUrl(uploadedImageUrl);

      // Step 2: Generate AI image using Gemini
      const generateResponse = await fetch("http://localhost:3000/api/generateImage/v1/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          instruction: finalPrompt,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate image");
      }
      
      const response = await generateResponse.json();
      console.log("Gemini API Response:", response);

      if (response.status === "success" && response.editedImage) {
        setGeneratedImageUrl(response.editedImage);
      } else {
        throw new Error(response.msg || "Failed to generate image");
      }

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen text-white">
      <style jsx>{`
        .dropdown-container {
          margin-bottom: 2rem;
          z-index: 10;
        }
        .dropdown-container select {
          position: relative !important;
          z-index: 10;
        }
        /* Ensure dropdown opens downward */
        .dropdown-container select:focus {
          position: relative !important;
          z-index: 999;
        }
        /* Add space below for dropdown */
        .form-container {
          padding-bottom: 20rem;
        }
      `}</style>
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">AI Rhinoplasty Simulator</h1>
      
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 relative overflow-hidden">
        {/* Background glowing effect */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center top, rgba(128, 0, 128, 0.1), transparent 50%)' }}></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 form-container">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Your Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>

            {previewUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Nose Type
              </label>
              <div className="relative dropdown-container">
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {Object.entries(RHINOPLASTY_OPTIONS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedOption === "custom" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Instructions
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe how you want your nose to look..."
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={4}
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedImage || (selectedOption === "custom" && !customPrompt) || isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                !selectedImage || (selectedOption === "custom" && !customPrompt) || isLoading
                  ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Simulation...
                </div>
              ) : (
                "Generate Simulation"
              )}
            </button>
          </div>
        </form>

        {(originalImageUrl || generatedImageUrl) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {originalImageUrl && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-purple-700">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Original Photo</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-600">
                  {originalImageUrl && originalImageUrl !== "" ? (
                    <Image
                      src={originalImageUrl}
                      alt="Original"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image uploaded yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-purple-700">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Simulated Outcome</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-600">
                  {generatedImageUrl && generatedImageUrl !== "" ? (
                    <Image
                      src={generatedImageUrl}
                      alt="Generated"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image generated yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 