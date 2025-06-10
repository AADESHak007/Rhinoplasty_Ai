"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Download, Eraser, PaintBucket, RotateCcw } from 'lucide-react';

// Predefined nose type prompts
const RHINOPLASTY_FRONT_OPTIONS = {
  roman: {
    label: "Roman Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Wider, more prominent bridge width. TIP: Angular, well-defined tip with slight point. COLUMELLA: Visible, strong central column. ALAE: Proportioned nostrils with angular shape. Create strong, authoritative nose appearance from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  nubian: {
    label: "Nubian Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Broader bridge width, more substantial appearance. TIP: Wider, fuller tip with good definition. COLUMELLA: Well-proportioned central column. ALAE: Characteristically broad nostril base, wider flare. Create harmonious, broader nose structure from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  greek: {
    label: "Greek/Straight Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Narrow, straight bridge with clean lines. TIP: Refined, symmetrical tip with balanced proportions. COLUMELLA: Straight, well-defined central column. ALAE: Narrow, perfectly proportioned nostrils. Create classically proportioned, symmetrical nose from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  hooked: {
    label: "Hooked Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Bridge appears wider with visible prominence/fullness in upper portion. TIP: Well-defined tip with structured appearance. COLUMELLA: Strong, visible central column. ALAE: Proportioned nostrils complementing bridge structure. Create distinctive nose with prominent bridge from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  button: {
    label: "Button Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Narrow, delicate bridge. TIP: Small, rounded, button-like tip. COLUMELLA: Petite, refined central column. ALAE: Small, neat nostrils with gentle curves. Create small, delicate, youthful nose appearance from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  snub: {
    label: "Snub Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Low, wide bridge with flat appearance. TIP: Rounded, upturned tip showing nostril visibility. COLUMELLA: Short, compact central column. ALAE: Wide nostril base with rounded, flared shape. Create compact, upturned nose with visible nostrils from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  hawk: {
    label: "Hawk/Aquiline Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Prominent, high bridge with substantial width and definition. TIP: Sharp, well-defined tip with angular structure. COLUMELLA: Strong, pronounced central column. ALAE: Proportioned nostrils with defined edges. Create striking, prominent nose with aristocratic appearance from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  bulbous: {
    label: "Bulbous Nose(Front)",
    prompt: "TRANSFORM - Modify nasal anatomy from front view: DORSUM: Standard bridge width. TIP: Wide, rounded, soft tip that appears enlarged and fleshy. COLUMELLA: Proportioned to fuller tip. ALAE: Wider, softer nostril shape following bulbous tip. Create nose with characteristic enlarged, rounded tip from front. VIEW: Maintain exact front-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  custom: {
    label: "Custom",
    prompt: ""
  }
};
const RHINOPLASTY_SIDE_OPTIONS = {
  roman: {
    label: "Roman Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: High, prominent bridge with subtle downward curve. TIP: Well-defined, slightly pointed tip with downward projection. COLUMELLA: Strong, well-projected column. ALAE: Proportionate nostril shape. Create distinguished Roman nose with authoritative profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  nubian: {
    label: "Nubian Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Longer bridge with natural gentle curve, substantial projection. TIP: Fuller tip with good definition and natural curve. COLUMELLA: Well-proportioned projection. ALAE: Naturally flared nostril visible from side. Create harmonious Nubian nose with distinctive profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  greek: {
    label: "Greek/Straight Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Perfectly straight bridge from forehead to tip with no curves. TIP: Refined, balanced tip following straight line. COLUMELLA: Clean, linear projection. ALAE: Well-proportioned nostril profile. Create classical Greek nose with perfect straight profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  button: {
    label: "Button/Celestial Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Short, delicate bridge with gentle curve. TIP: Small, rounded tip with subtle upturn. COLUMELLA: Petite, refined projection. ALAE: Small nostril with soft curve. Create delicate button nose with youthful upturned profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  aquiline: {
    label: "Aquiline/Hooked Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Prominent bridge with characteristic curved hump, distinctive arch. TIP: Well-defined tip following bridge curve. COLUMELLA: Strong projection. ALAE: Proportioned nostril complementing curved profile. Create distinctive hooked nose with aquiline profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  snub: {
    label: "Snub Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Low, short bridge with minimal projection. TIP: Rounded, distinctly upturned tip showing nostril from side. COLUMELLA: Short, compact projection. ALAE: Visible nostril due to upturned angle. Create compact snub nose with characteristic upturned profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
  },
  hawk: {
    label: "Hawk Nose (Side)",
    prompt: "TRANSFORM - Modify nasal anatomy from side view: DORSUM: Prominently high bridge with pronounced downward curve, eagle-like arch. TIP: Sharp, well-defined tip following dramatic curve. COLUMELLA: Strong, pronounced projection. ALAE: Defined nostril shape complementing hawk profile. Create striking hawk nose with aristocratic curved profile. VIEW: Maintain exact side-facing angle. CRITICAL: Do not change facial expression, eye color, lip shape, skin texture, or face angle. PRESERVE: exact same lighting, shadows, and image quality."
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
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for mask
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
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
            if (error.name === 'AbortError') {
              if (attempt < maxRetries) {
                console.log(`Mask upload timed out, retrying in 1 second... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              } else {
                throw new Error("Mask upload timed out. Please try again.");
              }
            } else if (error.message.includes('network')) {
              if (attempt < maxRetries) {
                console.log(`Network error, retrying mask upload in 2 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              } else {
                throw new Error("Network error during mask upload. Please try again.");
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
    <div className="bg-gray-800 rounded-lg p-6 border border-purple-700">
      <h3 className="text-xl font-bold mb-4 text-center text-purple-400">Create Your Mask</h3>
      
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300">Brush Size:</label>
          <input
            type="range"
            min="5"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-8 text-gray-300">{brushSize}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
              tool === 'brush' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            <PaintBucket className="w-4 h-4" />
            Brush
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
              tool === 'eraser' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            <Eraser className="w-4 h-4" />
            Eraser
          </button>
        </div>
        
        <button
          onClick={clearMask}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
        
        <button
          onClick={downloadMask}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={generateMask}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors"
        >
          Generate Mask
        </button>
      </div>

      {/* Canvas Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Image */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2 text-gray-300">Original Image</h4>
          <div className="border border-gray-600 rounded inline-block">
            <canvas
              ref={imageCanvasRef}
              className="max-w-full max-h-80 block rounded"
            />
          </div>
        </div>
        
        {/* Mask Canvas */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2 text-gray-300">Mask (White = Change, Black = Keep)</h4>
          <div className="border border-gray-600 rounded inline-block">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-80 block cursor-crosshair rounded"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-700">
        <h4 className="font-semibold text-purple-300 mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong className="text-white">White areas</strong> will be modified by AI (nose area)</li>
          <li>• <strong className="text-white">Black areas</strong> will remain unchanged</li>
          <li>• Use the brush to paint white on the nose area you want to change</li>
          <li>• Use the eraser to remove white areas (make them black again)</li>
          <li>• Click &quot;Generate Mask&quot; when ready to proceed</li>
        </ul>
      </div>

      {maskDataUrl && (
        <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700">
          <p className="text-green-300 font-semibold">✅ Mask generated successfully!</p>
          <p className="text-sm text-green-400 mt-1">You can now generate the simulation.</p>
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
          
          const controller = new AbortController();
          // Increased timeout to 120 seconds (2 minutes) for larger images
          const timeoutId = setTimeout(() => controller.abort(), 120000);
          
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
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
            if (error.name === 'AbortError') {
              if (attempt < maxRetries) {
                console.log(`Upload timed out, retrying in 2 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              } else {
                throw new Error("Upload timed out after multiple attempts. Please try with a smaller image or check your connection.");
              }
            } else if (error.message.includes('timeout') || error.message.includes('network')) {
              if (attempt < maxRetries) {
                console.log(`Network error, retrying in 3 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                continue;
              } else {
                throw new Error("Upload failed due to network issues. Please check your connection and try again.");
              }
            } else {
              // For other errors, don't retry immediately
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
          guidance: 30,
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
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Step 1: Upload Image */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 relative overflow-hidden">
          {/* Background glowing effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center top, rgba(128, 0, 128, 0.1), transparent 50%)' }}></div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-xl font-bold text-center text-purple-400 mb-4">Step 1: Upload Your Photo</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose Your Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <button
                  onClick={handleUploadAndShowMask}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                    isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
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
          <MaskGenerator 
            uploadedImageUrl={originalImageUrl} 
            onMaskGenerated={handleMaskGenerated}
          />
        )}

        {/* Step 3: Configure & Generate */}
        {maskImageUrl && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center top, rgba(128, 0, 128, 0.1), transparent 50%)' }}></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 form-container">
              <h2 className="text-xl font-bold text-center text-purple-400 mb-4">Step 3: Configure & Generate</h2>

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
                    Please describe how you want your nose to look (mention the view: FRONT or SIDE)
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
                disabled={!originalImageUrl || !maskImageUrl || (selectedOption === "custom" && !customPrompt) || isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  !originalImageUrl || !maskImageUrl || (selectedOption === "custom" && !customPrompt) || isLoading
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
            </form>
          </div>
        )}

        {/* Results */}
        {(originalImageUrl || generatedImageUrl) && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-800">
            <h2 className="text-xl font-bold text-center text-purple-400 mb-6">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {originalImageUrl && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-purple-700">
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Original Photo</h3>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-600">
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

              {generatedImageUrl && generatedImageUrl.trim() !== "" && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-purple-700">
                  <h3 className="text-lg font-medium text-gray-200 mb-2">Simulated Outcome</h3>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-600">
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
          </div>
        )}
      </div>
    </div>
  );
} 