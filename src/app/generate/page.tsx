"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// Predefined nose type prompts
const RHINOPLASTY_FRONT_OPTIONS = {
  roman: {
    label: "Roman Nose",
    prompt: "Transform the front-facing nose to Roman characteristics: **Nasal Bridge Width**: Create a prominently wide dorsal bridge that appears bold and substantial from the frontal view. **Bridge Definition**: Develop sharp, angular definition along the nasal bones with clear shadowing that emphasizes the elevated structure. **Nostril Shape**: Form symmetrical, moderately narrow nostrils that complement the strong bridge width. **Nasal Width**: Maintain proportional width that balances with the prominent bridge structure. **Bridge Projection**: Ensure the bridge creates visible shadowing on both sides, indicating significant height and projection. **Overall Proportions**: Create a commanding, substantial appearance that dominates the central facial features. PRESERVATION REQUIREMENTS: Keep identical eyes, mouth, face shape, skin texture, hair, lighting, background, facial expression, eye color, lip shape, skin tone, shadows, image quality, head position, and angle. CRITICAL: Modify ONLY the nose structure from front view - all other facial elements must remain pixel-perfect to original."
  },
  nubian: {
    label: "Nubian Nose",
    prompt: "Modify the front-facing nose to Nubian characteristics: **Nasal Base Width**: Create a notably wider nasal base that extends proportionally across the lower third of the nose. **Nostril Flaring**: Develop elegantly flared nostrils that curve outward with natural, graceful lines visible from the front. **Bridge Width**: Maintain moderate bridge width that harmonizes with the expanded base. **Nostril Shape**: Form full, rounded nostril openings that are symmetrical and well-defined. **Alar Width**: Extend the alar (nostril wing) width to create the characteristic broad appearance. **Proportional Balance**: Ensure the wider base maintains harmony with overall facial proportions. PRESERVATION REQUIREMENTS: Keep identical eyes, eyebrows, lips, facial structure, skin tone, hair, lighting, facial expression, eye color, lip shape, skin texture, shadows, image quality, head position, and angle. CRITICAL: Transform ONLY the nose to Nubian characteristics - preserve all other features exactly as original."
  },
  greek: {
    label: "Greek/Straight Nose",
    prompt: "Transform the front-facing nose to Greek/Classical characteristics: **Bridge Straightness**: Create perfectly straight nasal bones with no curves, bumps, or irregularities when viewed from the front. **Bridge Width**: Develop a refined, moderate width that creates clean, parallel lines down the nasal sides. **Nostril Symmetry**: Form perfectly symmetrical, oval-shaped nostrils with classical proportions. **Nasal Tip Definition**: Create a refined, straight tip that maintains the linear geometry of the bridge. **Overall Geometry**: Ensure mathematical precision in proportions typical of Greek classical sculpture. **Bridge Definition**: Maintain subtle but clear definition without excessive width or narrowness. PRESERVATION REQUIREMENTS: Keep identical eye shape, mouth, cheeks, jawline, skin, hair, background, facial expression, eye color, lip shape, skin texture, lighting, shadows, image quality, head position, and angle. CRITICAL: Modify ONLY the nose to achieve perfect Greek straightness and symmetry - maintain all other features unchanged."
  },
  button: {
    label: "Button/Celestial Nose",
    prompt: "Transform the front-facing nose to Button/Celestial characteristics: **Overall Size**: Create a noticeably smaller, more petite nose that appears delicate and compact from the frontal view. **Nasal Width**: Develop a narrow bridge width that emphasizes the diminutive appearance. **Nostril Shape**: Form small, rounded nostrils that appear slightly upturned due to the celestial tip angle. **Tip Definition**: Create a soft, rounded tip that lacks sharp definition and appears naturally upturned. **Bridge Height**: Maintain minimal bridge projection that doesn't create heavy shadowing. **Feminine Proportions**: Ensure delicate, refined proportions that appear naturally small and upturned. PRESERVATION REQUIREMENTS: Keep identical face structure, eyes, lips, skin color, hair style, lighting, facial expression, eye color, lip shape, skin texture, shadows, image quality, head position, and angle. CRITICAL: Transform ONLY the nose to button/celestial style - preserve all other facial elements exactly."
  },
  aquiline: {
    label: "Aquiline/Hooked Nose",
    prompt: "Modify the front-facing nose to Aquiline/Hooked characteristics: **Bridge Prominence**: Create a dramatically prominent, curved bridge that projects significantly from the face, visible even from the front view. **Bridge Width**: Develop a substantial width that emphasizes the powerful, hooked structure. **Nostril Asymmetry**: Form nostrils that may appear slightly asymmetrical due to the dramatic bridge curvature. **Tip Projection**: Create a projecting tip that extends the curved line of the bridge when viewed frontally. **Shadowing Effects**: Ensure the prominent structure creates natural shadowing that emphasizes the aquiline character. **Dominant Presence**: Make the nose a commanding central feature with strong character. PRESERVATION REQUIREMENTS: Keep identical eyes, mouth, face shape, skin tone, hair, expression, eye color, lip shape, skin texture, lighting, shadows, image quality, head position, and angle. CRITICAL: Modify ONLY the nose to aquiline characteristics - preserve all other facial features perfectly."
  },
  snub: {
    label: "Snub Nose",
    prompt: "Transform the front-facing nose to Snub characteristics: **Shortened Length**: Create a noticeably shorter nose with compact vertical dimensions from bridge to tip. **Upturned Tip**: Develop a distinctly upturned tip that makes the nostril openings more visible from the front view. **Nostril Visibility**: Form nostrils that are more prominent and visible due to the upward tilt of the tip. **Bridge Concavity**: Create a slight concave curve or flattened bridge profile. **Compact Proportions**: Ensure overall petite, turned-up appearance that appears naturally short. **Tip Roundness**: Develop a rounded, soft tip that lacks sharp definition. PRESERVATION REQUIREMENTS: Keep identical eye color and shape, lips, facial proportions, skin, hair, lighting, facial expression, eye color, lip shape, skin texture, shadows, image quality, head position, and angle. CRITICAL: Transform ONLY the nose to snub style - maintain all other features exactly as original."
  },
  bulbous: {
    label: "Bulbous Nose",
    prompt: "Transform the front-facing nose to Bulbous characteristics: **Tip Enlargement**: Create a significantly enlarged, rounded tip that appears full and prominent from the frontal view. **Tip Width**: Develop substantial width at the nasal tip that contrasts with a normal bridge width. **Nostril Distortion**: Form nostrils that accommodate the enlarged tip, potentially appearing stretched or widened. **Tip Projection**: Ensure the bulbous tip projects forward, creating natural shadowing around the enlarged area. **Bridge Contrast**: Maintain normal bridge proportions that emphasize the contrast with the enlarged tip. **Rounded Definition**: Create soft, rounded contours without sharp angles at the tip area. PRESERVATION REQUIREMENTS: Keep identical eyes, eyebrows, mouth shape, cheeks, chin, skin, hair, facial expression, eye color, lip shape, skin texture, lighting, shadows, image quality, head position, and angle. CRITICAL: Transform ONLY the nasal tip to bulbous characteristics - preserve everything else exactly."
  },
  hawk: {
    label: "Hawk Nose",
    prompt: "Modify the front-facing nose to Hawk characteristics: **Bridge Sharpness**: Create an exceptionally sharp, narrow bridge with angular definition that appears blade-like from the front. **Bridge Height**: Develop dramatic height and projection that creates strong shadowing on both sides. **Tip Narrowness**: Form a very narrow, pointed tip that extends the sharp geometry of the bridge. **Nostril Shape**: Create narrow, elongated nostrils that complement the sharp, predatory appearance. **Angular Definition**: Ensure all contours are sharp and defined rather than soft or rounded. **Predatory Character**: Develop a commanding, hawk-like appearance with strong, angular features. PRESERVATION REQUIREMENTS: Keep identical facial structure, eyes, lips, skin tone, hair color, background, facial expression, eye color, lip shape, skin texture, lighting, shadows, image quality, head position, and angle. CRITICAL: Transform ONLY the nose to hawk-like characteristics - maintain all other facial elements perfectly unchanged."
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};
const RHINOPLASTY_SIDE_OPTIONS = {
  roman: {
    label: "Roman Nose",
    prompt: "Transform the side profile nose to exhibit classic Roman characteristics: **Nasal Bridge**: Create a prominently elevated, straight dorsal bridge extending from the nasion (between eyebrows) in a bold linear projection. **Dorsal Hump**: Develop a distinctive convex curve or pronounced bump along the upper two-thirds of the nasal bridge, positioned 60-70% down from the nasion. **Nasal Tip**: Form a slightly downward-pointing tip with subtle drooping effect, creating an aquiline profile. **Nostril Shape**: Maintain natural proportions complementing the enhanced bridge structure. **Profile Angle**: Ensure strong, angular silhouette when viewed from the side. PRESERVATION REQUIREMENTS: Maintain identical eyes, lips, skin texture, hair, lighting, shadow placement, facial expression, head angle, jawline, facial contours, image resolution, and background. CRITICAL: Change ONLY the nose structure from side view - all other elements must remain pixel-perfect to original."
  },
  nubian: {
    label: "Nubian Nose",
    prompt: "Modify the side profile nose to Nubian characteristics: **Nasal Bridge**: Create a gently curved, elongated bridge with moderate height and graceful arch. **Nasal Length**: Extend the nose vertically to create an elegant, elongated appearance from nasion to tip. **Nasal Base**: Develop a proportionally wider base that maintains harmony with the extended length. **Nostril Shape**: Form subtly flared nostrils that are slightly visible from the profile view with natural, soft curves. **Nasal Tip**: Create a refined tip that projects naturally without excessive upturn or downturn. **Profile Characteristics**: Ensure the overall silhouette shows elegant length and proportion. PRESERVATION REQUIREMENTS: Keep identical facial angle, skin tone, eye placement, lips, hairstyle, lighting, head tilt, profile angle, shadows, image quality, facial proportions, and background. CRITICAL: Modify ONLY the nose shape from side profile - preserve all other facial features exactly."
  },
  greek: {
    label: "Greek/Straight Nose",
    prompt: "Transform the side profile nose to Greek/Classical characteristics: **Nasal Bridge**: Create a perfectly straight dorsal line from the nasion to the nasal tip without any curvature, bumps, or depressions. **Bridge Height**: Maintain moderate elevation that creates a clean, linear profile. **Nasal Tip**: Form a refined, straight tip that continues the linear bridge without upturn or downturn. **Nostril Shape**: Keep natural, symmetrical nostrils that complement the straight bridge structure. **Profile Line**: Ensure the nose creates an unbroken straight line from forehead transition to tip. **Classical Proportions**: Maintain harmonious proportions typical of Greek classical sculpture. PRESERVATION REQUIREMENTS: Keep identical eyes, lips, face shape, lighting, skin tone, head angle, profile structure, shadows, image quality, facial expression, hair, and background. CRITICAL: Modify ONLY the nose bridge and tip to achieve perfect straightness - all other features must remain unchanged."
  },
  button: {
    label: "Button/Celestial Nose",
    prompt: "Modify the side profile nose to Button/Celestial characteristics: **Nasal Bridge**: Create a soft, gently curved bridge with minimal height and smooth transitions. **Nasal Length**: Develop a shorter nose with compact proportions from nasion to tip. **Nasal Tip**: Form a distinctly upturned tip that curves skyward, creating the characteristic 'celestial' appearance. **Nostril Shape**: Shape slightly visible nostrils from the profile due to the upturned tip, maintaining natural curves. **Bridge Curve**: Ensure a soft, feminine curve along the bridge without harsh angles. **Overall Profile**: Create a petite, delicate appearance with upward projection. PRESERVATION REQUIREMENTS: Keep identical face structure, eyes, lips, skin color, hair, lighting, shadows, side view head angle, image depth, profile integrity, facial expression, and texture. CRITICAL: Transform ONLY the nose to button style - maintain all other facial elements exactly as original."
  },
  aquiline: {
    label: "Aquiline/Hooked Nose",
    prompt: "Transform the side profile nose to Aquiline/Hooked characteristics: **Nasal Bridge**: Create a prominent, curved bridge that arches outward with a distinctive convex shape. **Bridge Curve**: Develop a pronounced curve that creates a 'hook' or 'beak-like' appearance when viewed from the side. **Nasal Tip**: Form a downward-pointing tip that continues the curved trajectory, creating the characteristic hooked appearance. **Bridge Height**: Ensure significant elevation and projection from the face. **Nostril Shape**: Maintain natural nostril proportions that complement the hooked structure. **Profile Dynamics**: Create a dramatic, curved silhouette with strong character and presence. PRESERVATION REQUIREMENTS: Keep identical eyes, skin tone, lips, hair, background, lighting, head angle, profile line, shadows, image quality, facial expression, and all other facial details. CRITICAL: Modify ONLY the nose to aquiline shape - preserve every other element perfectly."
  },
  snub: {
    label: "Snub Nose",
    prompt: "Modify the side profile nose to Snub characteristics: **Nasal Length**: Create a noticeably shorter nose with compact vertical dimensions from nasion to tip. **Nasal Tip**: Form a distinctly upturned tip that tilts skyward, making nostrils partially visible from the side view. **Bridge Profile**: Develop a gentle, concave curve or slight depression along the bridge. **Nostril Visibility**: Ensure nostrils are subtly visible from the profile due to the upward tilt. **Overall Proportions**: Create a petite, button-like appearance with minimal projection from the face. **Tip Characteristics**: Make the tip slightly rounded and soft in appearance. PRESERVATION REQUIREMENTS: Keep identical eye shape and position, lip curve, face structure, skin texture, lighting, head angle, shadows, background, facial expression, and all other features. CRITICAL: Transform ONLY the nose to snub style - maintain all other elements exactly as original."
  },
  bulbous: {
    label: "Bulbous Nose",
    prompt: "Transform the side profile nose to Bulbous characteristics: **Nasal Tip**: Create a significantly enlarged, rounded tip that appears full and prominent from the side view. **Tip Projection**: Develop substantial forward projection of the bulbous tip beyond the normal nasal profile. **Bridge Relationship**: Maintain a normal bridge that contrasts with the enlarged tip area. **Nostril Shape**: Form naturally proportioned nostrils that accommodate the enlarged tip structure. **Tip Definition**: Create a soft, rounded appearance without sharp angles or definition. **Overall Balance**: Ensure the enlarged tip dominates the nasal profile while maintaining realistic proportions. PRESERVATION REQUIREMENTS: Keep identical facial expression, eyes, lips, cheekbones, chin, skin tone, hair, lighting, shadows, head angle, profile direction, and all other facial features. CRITICAL: Modify ONLY the nasal tip to bulbous shape - preserve everything else exactly as original."
  },
  hawk: {
    label: "Hawk Nose",
    prompt: "Modify the side profile nose to Hawk characteristics: **Nasal Bridge**: Create a sharp, highly prominent bridge with dramatic elevation and angular definition. **Bridge Curve**: Develop a pronounced downward curve that resembles a bird of prey's beak profile. **Nasal Tip**: Form a narrow, pointed tip that extends the downward curve with sharp definition. **Bridge Height**: Ensure maximum elevation and projection, creating a dramatic peak. **Angular Definition**: Develop sharp, defined angles rather than soft curves throughout the nasal structure. **Predatory Profile**: Create a strong, commanding appearance reminiscent of a hawk's beak. PRESERVATION REQUIREMENTS: Keep identical skin tone, face shape, eyes, lips, lighting, hair, shadows, original side head angle, image quality, facial expression, and all other features. CRITICAL: Transform ONLY the nose to hawk-like characteristics - maintain all other facial elements perfectly unchanged."
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