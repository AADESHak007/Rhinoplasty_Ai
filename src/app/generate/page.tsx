"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// Predefined nose type prompts
const RHINOPLASTY_FRONT_OPTIONS = {
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
  hawk: {
    label: "Hawk Nose",
    prompt: "Modify only the nose to a hawk nose shape with a  slight sharp but a bit curvy , prominent bridge and narrow tip, preserve everything else exactly: same facial structure, same eyes, same lips, same skin tone, same hair color, same background - alter only the nose to hawk type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};
const RHINOPLASTY_SIDE_OPTIONS = {
  roman: {
    label: "Roman Nose",
    prompt: "Transform only the side profile nose to a Roman nose style with a prominent bridge and slight downward curve at the tip, keep everything else exactly the same: same eyes, same mouth, same face shape, same skin, same hair, same lighting, same background - change only the nose to Roman type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  nubian: {
    label: "Nubian Nose",
    prompt: "Modify only the side profile nose to a Nubian nose shape with elongated bridge and wider base, preserve everything else identical: same eyes, same eyebrows, same lips, same facial structure, same skin tone, same hair, same lighting - alter only the nose to Nubian style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  greek: {
    label: "Greek/Straight Nose",
    prompt: "Change only the side profile nose to a Greek nose with a perfectly straight bridge from forehead to tip, maintain all other features unchanged: same eye shape, same mouth, same cheeks, same jawline, same skin, same hair, same background - modify only the nose to Greek/straight type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  button: {
    label: "Button/Celestial Nose",
    prompt: "Transform only the side profile nose to a button nose shape - small, upturned with a slight curve, keep everything else identical: same face structure, same eyes, same lips, same skin color, same hair style, same lighting - change only the nose to button/celestial style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  aquiline: {
    label: "Aquiline/Hooked Nose",
    prompt: "Modify only the side profile nose to an aquiline nose with a curved bridge forming a hook shape, preserve all other facial features: same eyes, same mouth, same face shape, same skin tone, same hair, same expression - alter only the nose to aquiline type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  snub: {
    label: "Snub Nose",
    prompt: "Change only the side profile nose to a snub nose - short, turned up at the tip with visible nostrils, maintain everything else unchanged: same eye color and shape, same lips, same facial proportions, same skin, same hair, same lighting - modify only the nose to snub style. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  hawk: {
    label: "Hawk Nose",
    prompt: "Modify only the side profile nose to a hawk nose shape with a sharp, prominent bridge and narrow tip, preserve everything else exactly: same facial structure, same eyes, same lips, same skin tone, same hair color, same background - alter only the nose to hawk type. CRITICAL: Do not change facial expression, eye color, lip shape, or skin texture. PRESERVE: exact same lighting, shadows, and image quality. MAINTAIN: original head position and angle"
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};



export default function GeneratePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedView, setSelectedView] = useState<string>("front");
  const [selectedOption, setSelectedOption] = useState<string>("roman");
  const [customPrompt, setCustomPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get current options based on selected view
  const currentOptions = selectedView === "front" ? RHINOPLASTY_FRONT_OPTIONS : RHINOPLASTY_SIDE_OPTIONS;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    // Reset to first option when view changes to avoid confusion
    setSelectedOption("roman");
  };

  const optimizePrompt = async () => {
    if (!customPrompt.trim()) {
      setError("Please enter a prompt to optimize");
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch("/api/optimizePrompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize prompt");
      }

      const { optimizedPrompt: optimized } = await response.json();
      setOptimizedPrompt(optimized);
      setCustomPrompt(optimized); // Update the custom prompt with optimized version
    } catch (error) {
      console.error("Error optimizing prompt:", error);
      setError(error instanceof Error ? error.message : "Failed to optimize prompt");
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetPrompt = () => {
    setOptimizedPrompt("");
    setCustomPrompt("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    // Use custom prompt if selected, otherwise use preset prompt from current options
    const finalPrompt = selectedOption === "custom" ? customPrompt : currentOptions[selectedOption as keyof typeof currentOptions].prompt;
    
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

      // Step 2: Generate AI image using api
      const generateResponse = await fetch("/api/generateImage/v1/gemini", {
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
    <div className="container mx-auto px-4 py-8 min-h-screen min-w-screen text-white">
      <style jsx>{`
        .dropdown-container {
          margin-bottom: 2rem;
          z-index: 10;
        }
        .dropdown-container select {
          position: relative !important;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
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
        /* Custom scrollbar for dropdown */
        .dropdown-container select::-webkit-scrollbar {
          width: 8px;
        }
        .dropdown-container select::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 4px;
        }
        .dropdown-container select::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
        }
        .dropdown-container select::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
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
              <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-700">
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
                Select View Angle
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="front"
                    checked={selectedView === "front"}
                    onChange={() => handleViewChange("front")}
                    className="mr-2 text-purple-600 focus:ring-purple-600"
                  />
                  <span className="text-gray-300">Front View</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="side"
                    checked={selectedView === "side"}
                    onChange={() => handleViewChange("side")}
                    className="mr-2 text-purple-600 focus:ring-purple-600"
                  />
                  <span className="text-gray-300">Side View</span>
                </label>
              </div>
            </div>

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
                  {Object.entries(currentOptions).map(([key, value]) => (
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
                  Please describe how you want your nose to look IMP : mention the view , FRONT or SIDE ... 
                </label>
                <div className="space-y-3">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe how you want your nose to look..."
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={optimizePrompt}
                      disabled={!customPrompt.trim() || isOptimizing}
                      className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                        !customPrompt.trim() || isOptimizing
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isOptimizing ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Optimizing...
                        </div>
                      ) : (
                        "✨ Optimize Prompt"
                      )}
                    </button>
                    {(customPrompt || optimizedPrompt) && (
                      <button
                        type="button"
                        onClick={resetPrompt}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                        title="Clear prompt"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  {optimizedPrompt && (
                    <div className="text-sm text-green-400 bg-green-900/20 p-3 rounded-md border border-green-700">
                      <strong>✅ Optimized:</strong> Your prompt has been enhanced for better results!
                    </div>
                  )}
                </div>
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
                <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-600">
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
                <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-600">
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