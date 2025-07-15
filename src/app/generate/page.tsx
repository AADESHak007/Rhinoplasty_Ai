"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Sparkles } from 'lucide-react';

// Add glitter animation CSS
const glitterStyle = `
@keyframes glitter {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px #a78bfa); }
  50% { opacity: 0.5; filter: drop-shadow(0 0 16px #a78bfa); }
}
.glitter-star {
  animation: glitter 1.2s infinite;
}
`;

// Predefined nose type prompts
const RHINOPLASTY_FRONT_OPTIONS = {
  roman: {
    label: "Roman Nose(Front)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose structure to have a wider, more prominent nasal bridge with angular, well-defined tip and strong authoritative appearance from front view. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
  },
  nubian: {
    label: "Nubian Nose(Front)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose to have notably wider nostril openings and fuller alar base creating a broader overall nasal appearance with a fuller, more rounded nasal tip. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
  },
  greek: {
    label: "Greek/Straight Nose(Front)",
    prompt: "Straighten the nasal dorsum, eliminating all curvatures and irregularities to achieve a completely aligned, straight, and a bit slimmer bridge. Refine the nasal tip to create a well-defined and balanced projection, maintaining the existing tip rotation and alar base width. Modify only the nasal structures; precisely adjust the nasal bridge and tip while meticulously preserving the existing skin tone, texture, and lighting; maintain the integrity of the eyes, eyebrows, cheeks, lips, jawline, hair, and facial expression, ensuring no alteration to these features.  Preserve the original image resolution and maintain a consistent overall facial harmony."
  },
  turnedUp: {
    label: "Turned Up Nose(Front)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose to have a pronounced upward angle of the nasal tip with clearly visible nostrils from front view, creating a shorter nose appearance with distinct nostril prominence. The upward tilt should be noticeable and well-defined. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
  },
  button: {
    label: "Button Nose(Front)",
    prompt: "Refine the nasal tip to achieve a smaller, rounded configuration, resembling a button shape.  Modify only the nasal dorsum to shorten its length and reduce its prominence, maintaining a straight profile.  Adjust the nasal tip and bridge in the front view only, meticulously preserving all other facial features including skin tone, eye shape and position, eyebrow shape and position, jawline, lip shape and position, cheek structure, facial expression, hair, and overall lighting and resolution.  Do not alter the alar base, columella, or any other facial feature beyond the specified nasal tip and dorsum modifications."
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};
const RHINOPLASTY_SIDE_OPTIONS = {
  roman: {
    label: "Roman Nose(Side)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose profile to have a subtle to moderate convex bump on the nasal bridge creating a noble classical Roman appearance, with a well-defined tip that has a slight downward point and balanced proportions from side view. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead contour, cheek structure, cheekbone definition, jawline profile, chin shape, chin projection, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, neck contour, ear shape, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal profile modified."
  },
  nubian: {
    label: "Nubian Nose(Side)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose profile to have a broader, more substantial nasal base with notably wider, more flared nostril openings and a fuller nasal tip with rounded appearance, creating a fuller, more prominent side profile. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead contour, cheek structure, cheekbone definition, jawline profile, chin shape, chin projection, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, neck contour, ear shape, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal profile modified."
  },
  greek: {
    label: "Greek/Straight Nose(Side)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose profile to have a perfectly straight nasal bridge from root to tip with no curves, bumps, or deviations, creating a classical linear Greek profile with refined, balanced proportions and elegant symmetry. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead contour, cheek structure, cheekbone definition, jawline profile, chin shape, chin projection, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, neck contour, ear shape, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal profile modified."
  },
  turnedUp: {
    label: "Turned Up Nose(Side)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose profile to have a moderate upward tilt of the nasal tip revealing partial nostril visibility from side view, creating a lifted, youthful appearance that's elegant and refined but more subtle than a button nose. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead contour, cheek structure, cheekbone definition, jawline profile, chin shape, chin projection, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, neck contour, ear shape, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal profile modified."
  },
  button: {
    label: "Button Nose(Side)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose profile to be smaller and more compact with a soft, rounded button-like shape featuring a petite, dramatically upturned tip and nostrils clearly visible from the side view, creating a cute, youthful profile. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead contour, cheek structure, cheekbone definition, jawline profile, chin shape, chin projection, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, neck contour, ear shape, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal profile modified."
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};


export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedView, setSelectedView] = useState<string>("front");
  const [selectedOption, setSelectedOption] = useState<string>("roman");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [maskImageUrl, setMaskImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aiImageDbId, setAiImageDbId] = useState<string>(""); // Used for state management
  const [aiImageCloudUrl, setAiImageCloudUrl] = useState<string>("");
  const [isStoring, setIsStoring] = useState(false);
  // Add new state to track upload/mask progress
  const [isUploading, setIsUploading] = useState(false);
  // Add selectedFile state and update handleImageSelect to store the file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [authFailed, setAuthFailed] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generatedNoseType, setGeneratedNoseType] = useState<string>("");
  
  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  // Progressive loader logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      // Reset progress when starting
      setProgress(0);
      let localProgress = 0;
      
      interval = setInterval(() => {
        // Slower, more gradual progress to 80%
        localProgress += Math.random() * 1.5 + 0.5; // 0.5 to 2.0 increment
        if (localProgress < 80) {
          setProgress(Math.floor(localProgress));
        } else {
          setProgress(80);
          clearInterval(interval!);
        }
      }, 100); // Slower updates for smoother feel
      
    } else if (!isLoading && progress > 0) {
      // When loading is complete, progress from current to 100%
      let localProgress = progress;
      
      interval = setInterval(() => {
        // 5% increments from current progress to 100%
        localProgress += 5;
        if (localProgress < 100) {
          setProgress(localProgress);
        } else {
          setProgress(100);
          clearInterval(interval!);
          
          // Reset progress after a delay for next generation
          setTimeout(() => {
            setProgress(0);
          }, 2000);
        }
      }, 200); // Slower increments for better UX
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progress]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the main content if not authenticated
  if (!session) {
    return null;
  }


  // Get current options based on selected view
  const currentOptions = selectedView === "front" ? RHINOPLASTY_FRONT_OPTIONS : RHINOPLASTY_SIDE_OPTIONS;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setMaskImageUrl("");
      setOriginalImageUrl("");
      setAuthFailed(false); // Reset auth failed flag for new image
    }
  };

  const handleMaskAndUpload = async () => {
    setError(null);
    setIsUploading(true);
    try {
      if (!previewUrl) {
        setError('No image selected.');
        setIsUploading(false);
        return;
      }
      // Find the file from the previewUrl (not possible), so store the file in state
      // Instead, keep the file in a separate state variable
      if (!selectedFile) {
        setError('No image file found.');
        setIsUploading(false);
        return;
      }

      // Use the updated /api/upload-with-mask route that handles everything server-side
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadResponse = await fetch('/api/upload-with-mask', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('Upload/mask generation failed');
      }
      const { originalUrl, maskUrl } = await uploadResponse.json();
      setOriginalImageUrl(originalUrl);
      setMaskImageUrl(maskUrl);
    } catch (err) {
      setError('Image upload or mask generation failed. Please try again.');
      console.error('Upload/mask error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Store generated image when it's created
  const storeGeneratedImage = async (imageUrl: string, originalUrl: string, prompt?: string, noseType?: string) => {
    if (isStoring || authFailed) return; // Prevent multiple calls
    
    setIsStoring(true);
    try {
      const res = await fetch("/api/store-generated-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl,
          originalImageUrl: originalUrl,
          prompt: prompt,
          nose_type: noseType,
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 401) {
        console.log("User not authenticated, skipping image storage");
        setAuthFailed(true);
        return;
      }
      
      if (res.status === 200 && data.status === "success" && data.url && data.id) {
        setAiImageCloudUrl(data.url);
        setAiImageDbId(data.id);
        console.log("Image stored successfully:", data.id);
      } else if (data.status === "success" && data.message === "Image already processed") {
        setAiImageCloudUrl(data.url);
        setAiImageDbId(data.id);
        console.log("Image already processed:", data.id);
      } else {
        console.warn("Unexpected response from store-generated-image:", data);
      }
    } catch (error) {
      console.error("Error storing generated image:", error);
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Stepper */}
      <div className="flex flex-col items-center mb-6 sm:mb-8 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#181c2a] mt-6 sm:mt-8 mb-2 text-center">Generate Your Perfect Nose</h1>
        <p className="text-sm sm:text-lg text-[#4b5563] mb-4 sm:mb-6 text-center px-2">Follow the steps below to visualize your ideal nose shape with AI technology</p>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <div className={`flex flex-col items-center ${originalImageUrl ? 'text-[#7b5cff]' : 'text-gray-400'}`}>
            <span className="bg-white border-2 border-[#7b5cff] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-xl font-bold">
              {/* Upload Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-icon lucide-upload w-6 h-6"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
            </span>
            <span className="mt-1 sm:mt-2 font-semibold text-xs sm:text-sm">Upload</span>
          </div>
          <span className="w-6 sm:w-8 lg:w-12 h-1 bg-gray-200 rounded-full" />
          <div className={`flex flex-col items-center ${originalImageUrl ? 'text-[#7b5cff]' : 'text-gray-400'}`}>
            <span className="bg-white border-2 border-[#7b5cff] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-xl font-bold">
              {/* Settings Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings w-6 h-6"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <span className="mt-1 sm:mt-2 font-semibold text-xs sm:text-sm">Configure</span>
          </div>
          <span className="w-6 sm:w-8 lg:w-12 h-1 bg-gray-200 rounded-full" />
          <div className={`flex flex-col items-center ${generatedImageUrl ? 'text-[#7b5cff]' : 'text-gray-400'}`}>
            <span className="bg-white border-2 border-[#7b5cff] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-xl font-bold">
              {/* Zap Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap-icon lucide-zap w-6 h-6"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
            </span>
            <span className="mt-1 sm:mt-2 font-semibold text-xs sm:text-sm">Generate</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pb-6 sm:pb-10">
        {/* Step 1: Upload */}
        <div className="mb-6 sm:mb-10">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center mb-4 sm:mb-6">
              <span className="bg-[#2563eb] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold mr-2 sm:mr-3">1</span>
              <span className="text-lg sm:text-xl font-bold text-[#181c2a]">Upload Your Photo</span>
            </div>
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="font-bold text-blue-800">Photo Requirements for Best Results</span>
                </div>
                <ul className="list-disc pl-6 text-sm text-blue-900">
                  <li><span className="font-semibold">Front view:</span> Face the camera directly with your full face visible</li>
                  <li><span className="font-semibold">Side view:</span> Turn your head 90° to show your complete profile</li>
                  <li><span className="font-semibold">Frame:</span> Include from forehead to chin (full face visible)</li>
                  <li><span className="font-semibold">Quality:</span> Use good lighting and avoid shadows on your nose</li>
                </ul>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-[#f5f8fc]">
              {!previewUrl ? (
                <>
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                    <span className="bg-gray-100 rounded-full p-3 sm:p-4 mb-3 sm:mb-4">
                      <svg width="28" height="28" className="sm:w-9 sm:h-9" fill="none" viewBox="0 0 36 36"><path d="M18 6v18M6 18h24" stroke="#7b5cff" strokeWidth="3" strokeLinecap="round"/></svg>
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-[#181c2a] mb-2 text-center">Upload your photo</span>
                    <span className="text-xs sm:text-sm text-gray-500 text-center px-2">PNG, JPG up to 10MB • Best results with clear front or side view</span>
                    <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="bg-[#e9f0fb] border-2 border-dashed border-[#7b5cff] rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center w-full">
                    <Image src={previewUrl} alt="Preview" width={180} height={230} className="sm:w-[220px] sm:h-[280px] rounded-lg object-contain" />
                  </div>
                  <span className="text-[#2563eb] font-semibold mt-3 sm:mt-4 text-sm sm:text-base">Photo uploaded successfully!</span>
                  <span className="text-xs sm:text-sm text-gray-500 cursor-pointer mt-1" onClick={() => setPreviewUrl("")}>Click to change image</span>
                </div>
              )}
              {previewUrl && !originalImageUrl && !maskImageUrl && (
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
                  onClick={handleMaskAndUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Processing...' : 'Generate Mask and Upload'}
                </button>
              )}
              {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
              </div>
          </div>
        </div>

        {/* Step 2: Configure - Only show if both originalImageUrl and maskImageUrl are set */}
        {originalImageUrl && maskImageUrl ? (
          <div className="mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <span className="bg-[#2563eb] text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3">2</span>
                <span className="text-xl font-bold text-[#181c2a]">Configure Your Preferences</span>
            </div>
              <div className="mb-6">
                <span className="block font-semibold text-[#181c2a] mb-2">Select Photo View</span>
                <div className="flex gap-4 mb-4">
                  <label className={`flex-1 border rounded-lg px-4 py-3 cursor-pointer ${selectedView === 'front' ? 'border-[#7b5cff] bg-[#f5f8fc]' : 'border-gray-200 bg-white'}`}>
                    <input type="radio" value="front" checked={selectedView === "front"} onChange={() => setSelectedView('front')} className="hidden" />
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-semibold text-[#181c2a]">Front View</span>
                      <span className="text-xs text-gray-500">Best for frontal nose shape, symmetry and modifications</span>
          </div>
                  </label>
                  <label className={`flex-1 border rounded-lg px-4 py-3 cursor-pointer ${selectedView === 'side' ? 'border-[#7b5cff] bg-[#f5f8fc]' : 'border-gray-200 bg-white'}`}>
                    <input type="radio" value="side" checked={selectedView === "side"} onChange={() => setSelectedView('side')} className="hidden" />
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-semibold text-[#181c2a]">Side View</span>
                      <span className="text-xs text-gray-500">Best for nose shape, symmetry and modifications</span>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#181c2a] mb-2">Choose Your Ideal Nose Type</label>
                <div className="space-y-3">
                    {Object.entries(currentOptions).map(([key, value]) => (
                    <label key={key} className={`flex items-start border rounded-lg px-4 py-3 cursor-pointer transition-colors ${selectedOption === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                      <input
                        type="radio"
                        value={key}
                        checked={selectedOption === key}
                        onChange={() => setSelectedOption(key)}
                        className="mt-1 mr-3"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#181c2a]">
                          {value.label.replace(/\(.*\)/, '')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {key === 'greek' && 'Classic straight bridge'}
                          {key === 'button' && 'a soft, rounded button-like shape'}
                          {key === 'roman' && 'wider, more prominent nasal bridge'}
                          {key === 'turnedUp' && 'Slightly upward tip'}
                          {key === 'nubian' && 'a broader, nasal base with notably wider, more flared nostrils'}
                          {key === 'custom' && 'Custom Description , IMP : Make sure to describe the nose shape and the VIEW for better results '}
                        </span>
                      </div>
                    </label>
                  ))}
                  {selectedOption === 'custom' && (
                    <div className="mt-2 w-full">
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe your ideal nose shape in detail... (e.g., 'slightly smaller, more refined tip, straighter bridge')"
                        className="w-full px-3 py-2 border border-blue-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                      />
                      <button
                        type="button"
                        disabled={!customPrompt.trim() || isOptimizing}
                        onClick={async () => {
                          if (!customPrompt.trim()) return;
                          setIsOptimizing(true);
                          try {
                            const response = await fetch('/api/optimizePrompt', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ prompt: customPrompt }),
                            });
                            if (!response.ok) throw new Error('Failed to optimize prompt');
                            const data = await response.json();
                            setCustomPrompt(data.optimizedPrompt);
                          } catch (err) {
                            setError('Failed to optimize prompt. Please try again.');
                            console.error('Optimize prompt error:', err);
                          } finally {
                            setIsOptimizing(false);
                          }
                        }}
                        className={`mt-3 px-4 py-2 rounded-md font-semibold transition-colors ${
                          !customPrompt.trim() || isOptimizing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isOptimizing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Optimizing...
                          </div>
                        ) : (
                          'Optimize Prompt'
                        )}
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}
              <button
                type="button"
                disabled={isLoading || (selectedOption === 'custom' && !customPrompt)}
                className={`w-full mt-6 py-3 px-4 rounded-md text-white font-semibold transition-colors ${isLoading || (selectedOption === 'custom' && !customPrompt) ? 'bg-blue-500/60 cursor-not-allowed' : 'bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2]'}`}
                onClick={async () => {
                  setError(null);
                  const finalPrompt = selectedOption === 'custom' ? customPrompt : currentOptions[selectedOption as keyof typeof currentOptions].prompt;
                  console.log('originalImageUrl:', originalImageUrl);
                  console.log('maskImageUrl:', maskImageUrl);
                  console.log('finalPrompt:', finalPrompt);
                  if (!originalImageUrl || !maskImageUrl || !finalPrompt) {
                    setError('Missing required data: Please upload an image and ensure all fields are filled.');
                    console.error('Missing required data:', { originalImageUrl, maskImageUrl, finalPrompt });
                    return;
                  }
                  // Generate AI image
                  try {
                    setIsLoading(true);
                    const generateResponse = await fetch('/api/generateImage/v1/flux-fill-dev', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        imageUrl: originalImageUrl,
                        prompt: finalPrompt,
                        maskImage: maskImageUrl,
                        numInferenceSteps: 28,
                        guidance: 85,
                        numOutputs: 1,
                        megapixels: '1',
                        outputFormat: 'jpg',
                        outputQuality: 80,
                      }),
                    });
                    if (!generateResponse.ok) throw new Error('Failed to generate image');
                    const response = await generateResponse.json();
                    let extractedImageUrl = null;
                    if (response.output && Array.isArray(response.output) && response.output.length > 0) {
                      extractedImageUrl = response.output[0];
                    } else if (response.success && response.images && response.images.length > 0) {
                      extractedImageUrl = response.images[0];
                    }
                    if (!extractedImageUrl) throw new Error('No image returned');
                    setGeneratedImageUrl(extractedImageUrl);
                    
                    // Get the nose type label for storage
                    const noseTypeLabel = selectedOption === 'custom' ? 'Custom' : currentOptions[selectedOption as keyof typeof currentOptions].label;
                    
                    // Store the generated image in Cloudinary and DB
                    await storeGeneratedImage(extractedImageUrl, originalImageUrl, finalPrompt, noseTypeLabel);
                    
                    // Set the generated nose type for display
                    setGeneratedNoseType(noseTypeLabel);
                  } catch (err) {
                    setError('AI generation failed.');
                    console.error('AI generation error:', err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Generate Simulation'
                )}
              </button>
            </div>
          </div>
        ) : (
          previewUrl && (
            <div className="text-center text-blue-500 py-8">
            </div>
          )
        )}

        {/* Loader below Step 2 while generating */}
        {isLoading && (
          <>
            <style>{glitterStyle}</style>
            <div className="mb-10">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3">3</span>
                  <span className="text-xl font-bold text-[#181c2a] flex items-center"><Sparkles className="w-5 h-5 mr-2 text-blue-500" /> Generating Your Result</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 mb-4">
                    <Sparkles className="w-8 h-8 text-white glitter-star" />
                  </div>
                  <div className="text-xl font-semibold mb-2">AI is working its magic...</div>
                  <div className="text-gray-500 mb-4">Analyzing your photo and generating your perfect nose shape ...</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Results - Only show if output is generated */}
        {generatedImageUrl && !isLoading && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="bg-[#2563eb] text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3">3</span>
                <span className="text-xl font-bold text-[#181c2a]">Results</span>
              </div>
              {generatedNoseType && (
                <div className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {generatedNoseType}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original Photo Card */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-4 border-2 border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-[#185a9d]">Original Photo</h3>
                <div className="rounded-xl overflow-hidden border border-blue-200 bg-white flex items-center justify-center w-full h-80 relative">
                  {originalImageUrl && (
                    <Image
                      src={originalImageUrl}
                      alt="Original"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  )}
                </div>
              </div>
              {/* Simulated Outcome Card */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-4 border-2 border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-[#185a9d]">Simulated Outcome</h3>
                <div className="rounded-xl overflow-hidden border border-blue-200 bg-white flex items-center justify-center w-full h-80 relative">
                      <Image
                        src={generatedImageUrl}
                        alt="Generated"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                </div>
              </div>
            </div>
            {aiImageCloudUrl && (
              <div className="mt-6 text-center">
                <button
                  className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors"
                  onClick={async () => {
                    try {
                      const response = await fetch(aiImageCloudUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'ai-image.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Download failed:', error);
                    }
                  }}
                >
                  Download AI Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 