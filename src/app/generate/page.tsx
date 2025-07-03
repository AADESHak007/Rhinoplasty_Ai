"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Download, Eraser, PaintBucket, RotateCcw } from 'lucide-react';

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
    prompt: "NOSE MODIFICATION ONLY: Transform the nose to have a narrow, perfectly straight nasal bridge with clean geometric lines and refined, symmetrical tip with proportioned nostrils creating a classically balanced Greek nose appearance. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
  },
  turnedUp: {
    label: "Turned Up Nose(Front)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose to have a gentle upward angle of the nasal tip with partial nostril visibility from front view, creating a subtly lifted appearance that's refined and elegant. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
  },
  button: {
    label: "Button Nose(Front)",
    prompt: "NOSE MODIFICATION ONLY: Transform the nose to be smaller and more compact with a soft, rounded button-like shape featuring a distinctly upturned, petite tip and small, delicate nostril openings. ABSOLUTE PRESERVATION REQUIRED: Keep identical eye shape, eye color, eyebrow shape, eyebrow color, eyebrow position, forehead, cheek structure, cheekbone definition, jawline, chin shape, lip color (exact RGB values), lip texture, lip fullness, lip outline, mouth corners, philtrum, skin texture, skin tone (exact color match), facial hair, lighting direction, shadow placement, highlight placement, facial expression, head angle, camera angle, background. DO NOT alter face shape, facial proportions, or any feature outside the nose area. Same person, identical appearance, only nasal structure modified."
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

// MaskGenerator Component
const MaskGenerator = ({ uploadedImageUrl, onMaskGenerated }: { uploadedImageUrl: string, onMaskGenerated: (maskUrl: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState('brush'); // 'brush' or 'eraser'
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [isSavingMask, setIsSavingMask] = useState(false);

  useEffect(() => {
    if (uploadedImageUrl) {
      const drawImageOnCanvas = () => {
        const canvas = imageCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const img = document.createElement('img');
        
        img.onload = () => {
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Initialize mask canvas with same dimensions
          const maskCanvas = canvasRef.current;
          if (!maskCanvas) return;
          
          maskCanvas.width = img.width;
          maskCanvas.height = img.height;
          
          // Fill with black (preserved areas)
          const maskCtx = maskCanvas.getContext('2d');
          if (maskCtx) {
            maskCtx.fillStyle = 'black';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
          }
        };
        
        img.crossOrigin = 'anonymous';
        img.src = uploadedImageUrl;
      };
      
      drawImageOnCanvas();
    }
  }, [uploadedImageUrl]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setMaskDataUrl(null);
  };

  const generateMask = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setMaskDataUrl(dataUrl);
    setIsSavingMask(true);
    
    // Upload mask to get URL with retry logic
    const uploadMaskWithRetry = async (maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Mask upload attempt ${attempt}/${maxRetries}`);
          
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'mask.png', { type: 'image/png' });
          
          const formData = new FormData();
          formData.append('file', file);
          
          // Remove timeout - let the mask upload take as long as it needs
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Mask upload failed (${uploadResponse.status})`);
          }
          
          const { url } = await uploadResponse.json();
          
          if (!url) {
            throw new Error("No URL returned from mask upload");
          }
          
          console.log("Mask upload successful:", url);
          onMaskGenerated(url);
          return url;
          
        } catch (error) {
          console.error(`Mask upload attempt ${attempt} failed:`, error);
          
          if (error instanceof Error) {
            // Only retry on network errors
            if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('NetworkError')) {
              if (attempt < maxRetries) {
                console.log(`Network error, retrying mask upload in 2 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              } else {
                throw new Error("Network error during mask upload after multiple attempts. Please try again.");
              }
            } else {
              throw error;
            }
          }
        }
      }
    };
    
    try {
      return await uploadMaskWithRetry();
    } catch (error) {
      console.error('Final mask upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload mask. Please try again.');
      return dataUrl;
    } finally {
      setIsSavingMask(false);
    }
  };

  const downloadMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setMaskDataUrl(dataUrl);
    
    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl shadow-2xl p-8 border border-blue-400/30 backdrop-blur-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-200 tracking-wide">Create Your Mask</h3>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-100">Brush Size:</label>
          <input
            type="range"
            min="5"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24 accent-blue-400"
          />
          <span className="text-sm w-8 text-blue-100">{brushSize}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-md border border-blue-400/30 ${
              tool === 'brush' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
            }`}
          >
            <PaintBucket className="w-4 h-4" /> Brush
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-md border border-blue-400/30 ${
              tool === 'eraser' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-blue-800 text-blue-100 hover:bg-blue-700'
            }`}
          >
            <Eraser className="w-4 h-4" /> Eraser
          </button>
        </div>
        <button
          onClick={clearMask}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-md border border-red-400/40"
        >
          <RotateCcw className="w-4 h-4" /> Clear
        </button>
        <button
          onClick={downloadMask}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-md border border-green-400/40"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button
          onClick={generateMask}
          disabled={isSavingMask}
          className={`px-6 py-2 rounded-lg font-bold transition-colors shadow-md border border-purple-400/40 ${
            isSavingMask 
              ? 'bg-blue-500/60 cursor-not-allowed text-blue-100' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
          }`}
        >
          {isSavingMask ? (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Mask...
            </div>
          ) : (
            "Generate Mask"
          )}
        </button>
      </div>
      {/* Canvas Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2 text-blue-100">Original Image</h4>
          <div className="border-2 border-blue-400/30 rounded-xl inline-block bg-blue-900/40">
            <canvas
              ref={imageCanvasRef}
              className="max-w-full max-h-80 block rounded-xl"
            />
          </div>
        </div>
        {/* Mask Canvas */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2 text-blue-100">Mask (White = Change, Black = Keep)</h4>
          <div className="border-2 border-blue-400/30 rounded-xl inline-block bg-blue-900/40">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-80 block cursor-crosshair rounded-xl"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </div>
      {/* Instructions */}
      <div className="mt-8 p-5 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl border border-purple-400/40">
        <h4 className="font-semibold text-purple-200 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-100 space-y-1">
          <li>• <strong className="text-white">White areas</strong> will be modified by AI (nose area)</li>
          <li>• <strong className="text-white">Black areas</strong> will remain unchanged</li>
          <li>• Use the brush to paint white on the nose area you want to change</li>
          <li>• Use the eraser to remove white areas (make them black again)</li>
          <li>• Click .. Generate Mask .. when ready to proceed</li>
        </ul>
      </div>
      {isSavingMask && (
        <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-400/40">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-3 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-blue-200 font-semibold">Saving your mask...</p>
              <p className="text-sm text-blue-100 mt-1">Please wait while we process your mask.</p>
            </div>
          </div>
        </div>
      )}
      {maskDataUrl && !isSavingMask && (
        <div className="mt-6 p-4 bg-green-900/30 rounded-xl border border-green-400/40">
          <p className="text-green-200 font-semibold">✅ Mask generated successfully!</p>
          <p className="text-sm text-green-100 mt-1">You can now generate the simulation.</p>
        </div>
      )}
    </div>
  );
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
  const [maskImageUrl, setMaskImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showMaskGenerator, setShowMaskGenerator] = useState(false);

  // Get current options based on selected view
  const currentOptions = selectedView === "front" ? RHINOPLASTY_FRONT_OPTIONS : RHINOPLASTY_SIDE_OPTIONS;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setShowMaskGenerator(false);
      setMaskImageUrl("");
      setOriginalImageUrl("");
    }
  };

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    // Reset to first option when view changes to avoid confusion
    setSelectedOption("roman");
  };

  const handleUploadAndShowMask = async () => {
    if (!selectedImage) return;

    // Check file size (max 10MB)
    if (selectedImage.size > 10 * 1024 * 1024) {
      setError("Image file is too large. Please use an image under 10MB.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const uploadWithRetry = async (maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Upload attempt ${attempt}/${maxRetries}`);
          
          const formData = new FormData();
          formData.append("file", selectedImage);
          
          // Remove timeout - let the upload take as long as it needs
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Upload failed (${uploadResponse.status}). Please try again.`);
          }
          
          const { url: uploadedImageUrl } = await uploadResponse.json();
          
          if (!uploadedImageUrl) {
            throw new Error("No image URL returned from upload");
          }
          
          console.log("Upload successful:", uploadedImageUrl);
          return uploadedImageUrl;
          
        } catch (error) {
          console.error(`Upload attempt ${attempt} failed:`, error);
          
          if (error instanceof Error) {
            // Only retry on network errors, not on timeout or other errors
            if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('NetworkError')) {
              if (attempt < maxRetries) {
                console.log(`Network error, retrying in 3 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                continue;
              } else {
                throw new Error("Upload failed due to network issues after multiple attempts. Please check your connection and try again.");
              }
            } else {
              // For other errors, don't retry - just throw
              throw error;
            }
          } else {
            throw new Error("Failed to upload image. Please try again.");
          }
        }
      }
    };

    try {
      const uploadedImageUrl = await uploadWithRetry();
      setOriginalImageUrl(uploadedImageUrl);
      setShowMaskGenerator(true);

    } catch (error) {
      console.error("Final upload error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to upload image after multiple attempts. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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

  const handleMaskGenerated = (maskUrl: string) => {
    setMaskImageUrl(maskUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImageUrl || !maskImageUrl) {
      setError("Please upload an image and create a mask first");
      return;
    }

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
      // Generate AI image using FLUX Fill API
      const generateResponse = await fetch("/api/generateImage/v1/flux-fill-dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: originalImageUrl,
          prompt: finalPrompt,
          maskImage: maskImageUrl,
          numInferenceSteps: 28,
          guidance: 85,
          numOutputs: 1,
          megapixels: "1",
          outputFormat: "jpg",
          outputQuality: 80,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate image");
      }
      
      const response = await generateResponse.json();
      console.log("FLUX Fill API Response:", response);
      console.log("Raw output from API:", response.output);

      // Handle the actual FLUX Fill API response format
      let extractedImageUrl = null;
      
      if (response.output && Array.isArray(response.output) && response.output.length > 0) {
        extractedImageUrl = response.output[0];
        console.log("Extracted image URL from output:", extractedImageUrl);
        console.log("Type of extractedImageUrl:", typeof extractedImageUrl);
      } else if (response.success && response.images && response.images.length > 0) {
        extractedImageUrl = response.images[0];
        console.log("Extracted image URL from wrapped format:", extractedImageUrl);
        console.log("Type of extractedImageUrl:", typeof extractedImageUrl);
      } else {
        console.error("No valid image URL found in response:", response);
        throw new Error(response.error || "Failed to generate image");
      }

      // Ensure extractedImageUrl is a valid string
      if (!extractedImageUrl || typeof extractedImageUrl !== 'string' || extractedImageUrl.trim() === "") {
        console.error("Invalid image URL:", extractedImageUrl);
        throw new Error("Generated image URL is invalid or empty");
      }

      setGeneratedImageUrl(extractedImageUrl);
      console.log("Set generatedImageUrl to:", extractedImageUrl);

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-w-screen bg-gradient-to-br from-[#0a2342] via-[#185a9d] to-[#43cea2] text-white py-8 px-2">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-white drop-shadow-xl tracking-tight">AI Rhinoplasty Simulator</h1>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Step 1: Upload Image */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white px-6 py-2 rounded-full shadow-lg font-bold text-lg z-10 border-4 border-blue-200">Step 1</div>
          <div className="relative z-10 space-y-6 pt-6">
            <h2 className="text-2xl font-bold text-center text-[#185a9d] mb-4">Upload Your Photo</h2>
            <div>
              <label className="block text-sm font-medium text-[#185a9d] mb-2">Choose Your Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-[#0a2342] focus:outline-none focus:ring-2 focus:ring-[#43cea2] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#185a9d] file:text-white hover:file:bg-[#43cea2] "
              />
            </div>
            {previewUrl && (
              <div className="space-y-4">
                <div className="text-center text-[#185a9d] text-sm mb-4">Image selected successfully !!!</div>
                <button
                  onClick={handleUploadAndShowMask}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${isLoading ? 'bg-blue-400/60 cursor-not-allowed' : 'bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2]'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    "Upload & Continue to Mask Creation"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Create Mask */}
        {showMaskGenerator && originalImageUrl && (
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white px-6 py-2 rounded-full shadow-lg font-bold text-lg z-10 border-4 border-blue-200">Step 2</div>
            <div className="relative z-10 pt-6">
              <MaskGenerator uploadedImageUrl={originalImageUrl} onMaskGenerated={handleMaskGenerated} />
            </div>
          </div>
        )}

        {/* Step 3: Configure & Generate */}
        {maskImageUrl && (
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#43cea2] to-[#185a9d] text-white px-6 py-2 rounded-full shadow-lg font-bold text-lg z-10 border-4 border-blue-200">Step 3</div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 pt-6">
              <h2 className="text-2xl font-bold text-center text-[#185a9d] mb-4">Configure & Generate</h2>
              <div>
                <label className="block text-sm font-medium text-[#185a9d] mb-2">Select View Angle</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="front"
                      checked={selectedView === "front"}
                      onChange={() => handleViewChange("front")}
                      className="mr-2 text-blue-400 focus:ring-blue-400"
                    />
                    <span className="text-zinc-700 font-semibold text-sm">Front View</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="side"
                      checked={selectedView === "side"}
                      onChange={() => handleViewChange("side")}
                      className="mr-2 text-blue-400 focus:ring-blue-400"
                    />
                    <span className="text-zinc-700 font-semibold text-sm">Side View</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#185a9d] mb-2">Select Nose Type</label>
                <div className="relative dropdown-container">
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {Object.entries(currentOptions).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedOption === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-[#185a9d] mb-2">Please describe how you want your nose to look (mention the view: FRONT or SIDE)</label>
                  <div className="space-y-3">
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe how you want your nose to look..."
                      className="w-full px-3 py-2 border border-blue-400/30 rounded-md bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={optimizePrompt}
                        disabled={!customPrompt.trim() || isOptimizing}
                        className={`flex-1 py-2 px-4 rounded-md text-white font-semibold transition-colors ${!customPrompt.trim() || isOptimizing ? 'bg-blue-500/60 cursor-not-allowed' : 'bg-[#185a9d] text-white hover:bg-[#43cea2]'}`}
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
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors"
                          title="Clear prompt"
                        >
                          CLEAR
                        </button>
                      )}
                    </div>
                    {optimizedPrompt && (
                      <div className="text-sm text-center text-green-400 bg-blue-900 p-3 rounded-md border border-green-700">
                        <strong>Optimized:</strong> Your prompt has been enhanced for better results!
                      </div>
                    )}
                  </div>
                </div>
              )}
              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}
              <button
                type="submit"
                disabled={!originalImageUrl || !maskImageUrl || (selectedOption === "custom" && !customPrompt) || isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${!originalImageUrl || !maskImageUrl || (selectedOption === "custom" && !customPrompt) || isLoading ? 'bg-blue-500/60 cursor-not-allowed' : 'bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2]'}`}
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
              {generatedImageUrl && !isLoading && (
                <div className="mt-4 p-4 bg-gradient-to-r from-[#43cea2] to-[#185a9d] hover:from-[#185a9d] hover:to-[#43cea2] rounded-lg border border-green-700">
                  <div className="text-center ">
                    <p className="text-white font-semibold text-lg"> Generation Complete!</p>
                    <p className="text-zinc-200 mt-2">Your rhinoplasty simulation is ready. <span className="font-medium"> Scroll down to see your results!</span></p>
                    <div className="mt-2 text-green-300 animate-bounce">↓ ↓ ↓</div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
        {/* Results (consistent style) */}
        {maskImageUrl && (isLoading || generatedImageUrl) && (
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 mt-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#185a9d] tracking-wide">Results</h2>
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
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#185a9d] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[#185a9d]">Generating your simulation...</p>
                    </div>
                  ) : (
                    generatedImageUrl && generatedImageUrl.trim() !== "" && (
                      <Image
                        src={generatedImageUrl}
                        alt="Generated"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 