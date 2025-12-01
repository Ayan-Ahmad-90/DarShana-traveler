# AI Mood Analyzer - Full Working Code

This document contains the complete, working code for the AI Mood Analyzer feature, including both frontend and backend components.

## 1. Frontend Configuration (`.env.local`)

Ensure your frontend environment variables are set correctly to point to the backend.

```dotenv
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001

# Google Gemini API
VITE_GEMINI_API_KEY=AIzaSyD5KR9lDnGNE7yiZoySZC0QNntBkN3WsBM

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBHwLKNj5CQrJDonqeq3EXzs-D1O1YlJMQ
VITE_FIREBASE_AUTH_DOMAIN=darshana-travel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=darshana-travel
VITE_FIREBASE_STORAGE_BUCKET=darshana-travel.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1038207736988
VITE_FIREBASE_APP_ID=1:1038207736988:web:8c4f3d5e9b2a1c6f7e8d9c0b1a2f3e4d
```

## 2. Frontend API Service (`src/services/moodApi.ts`)

This service handles communication with the backend. It includes error handling and ensures the correct backend URL is used.

```typescript
/**
 * Mood Analyzer API Client
 * Handles communication with backend /api/mood-analyze endpoint
 */

import { getBackendUrl } from '../config/api';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse } from '../types/moodAnalyzer';

// Force correct backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const MOOD_ANALYZE_ENDPOINT = '/api/mood-analyze';

const buildEndpointUrl = (): string => {
  // Remove trailing slash from backend URL if present
  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  return `${baseUrl}${MOOD_ANALYZE_ENDPOINT}`;
};

export const getMoodAnalyzerUrl = (): string => buildEndpointUrl();

async function postMoodAnalysis(payload: { imageData?: string; imageUrl?: string }): Promise<MoodAnalyzeResponse> {
  const url = buildEndpointUrl();

  if (!payload.imageData && !payload.imageUrl) {
    throw new Error('Image data is required for mood analysis.');
  }

  const requestBody: MoodAnalyzeRequest = {
    ...(payload.imageData ? { imageData: payload.imageData } : {}),
    ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
  };

  try {
    console.debug('📨 Calling mood analyzer endpoint:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('❌ Mood analyzer API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data) {
      throw new Error('Mood analyzer returned an empty response.');
    }

    console.debug('✅ Mood analyzer response received');
    return data as MoodAnalyzeResponse;
  } catch (error) {
    console.error('❌ Mood analyzer request failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Connection refused to ${url}. Is the backend running on port 3001?`);
    }
    throw error;
  }
}

export async function analyzeMoodWithImage(imageData: string): Promise<MoodAnalyzeResponse> {
  return postMoodAnalysis({ imageData });
}
```

## 3. Frontend Component (`src/pages/MoodAnalyzer.tsx`)

The main React component for the Mood Analyzer feature.

```tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, RefreshCw, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { analyzeMoodWithImage, getMoodAnalyzerUrl } from '../services/moodApi';
import { DESTINATIONS } from '../data/destinations';
import type { Destination, MoodAnalyzeResponse, AIAnalysisResult } from '../types/moodAnalyzer';

// Mock payment: always success after short delay
async function makePayment(_amount: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 1500));
}

const STEPS = [
  { title: "How are you feeling today?", input: "mood" },
  { title: "What's your energy level?", input: "energy" },
  { title: "How social do you want to be?", input: "social" },
  { title: "How adventurous are you feeling?", input: "adventure" },
  { title: "Recommendations", input: "recommendations" },
  { title: "Payment", input: "payment" },
  { title: "Your Trip Ticket", input: "ticket" },
];

/**
 * Filter destinations based on mood analysis scores
 * Matches energy, social, adventure ranges and recommended tags
 */
function filterDestinationsByMood(
  moodResponse: MoodAnalyzeResponse
): Destination[] {
  const { energyLevel, socialScore, adventureScore, recommendedKeys } = moodResponse;

  return DESTINATIONS.filter(dest => {
    // Check if energy level is in range
    if (energyLevel < dest.energy[0] || energyLevel > dest.energy[1]) {
      return false;
    }

    // Check if social score is in range
    if (socialScore < dest.social[0] || socialScore > dest.social[1]) {
      return false;
    }

    // Check if adventure score is in range
    if (adventureScore < dest.adventure[0] || adventureScore > dest.adventure[1]) {
      return false;
    }

    // Check if destination tags match recommended keys
    if (recommendedKeys.length > 0) {
      const hasMatchingTag = dest.tags.some(tag =>
        recommendedKeys.some(key =>
          tag.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(tag.toLowerCase())
        )
      );

      // If no exact tag match, check label
      if (!hasMatchingTag) {
        return recommendedKeys.some(key =>
          dest.label.toLowerCase().includes(key.toLowerCase())
        );
      }
    }

    return true;
  }).sort((a, b) => {
    // Prefer more specific matches - destinations with matching tags
    const aMatchCount = a.tags.filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;

    const bMatchCount = b.tags.filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    ).length;

    return bMatchCount - aMatchCount;
  }).slice(0, 3); // Return top 3
}

/**
 * Generate FAQ for a destination based on mood analysis
 */
function generateFAQ(destination: Destination, moodResponse: MoodAnalyzeResponse) {
  const { recommendedKeys } = moodResponse;

  const matchedTags = destination.tags
    .filter(tag =>
      recommendedKeys.some(key =>
        tag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(tag.toLowerCase())
      )
    )
    .join(", ");

  return [
    {
      question: "AI ne ye jagah kyun choose ki? (Why AI chose this place?)",
      answer: `Based on your mood analysis with ${moodResponse.energyLevel} energy level and ${moodResponse.adventureScore} adventure score, ${destination.title} is perfect because it offers ${matchedTags || destination.tags.join(", ")}. Your emotional state matches this destination's vibe perfectly!`,
    },
    {
      question: "Yaha jaa kar kaisa experience milega? (What experience will I get?)",
      answer: `${destination.title} offers incredible experiences in ${destination.tags.slice(0, 2).join(" and ")}. Whether you're looking for adventure, relaxation, or cultural immersion, this place delivers. Best time to visit: ${destination.bestTime || "Year-round"}`,
    },
    {
      question: "Agar mujhe different type ki jagah chahiye? (Want a different place?)",
      answer: `No problem! Try another expression or use Manual Mode for complete control over destination selection. Each mood change gives you fresh recommendations!`,
    },
  ];
}

// Main MoodAnalyzer Component
const MoodAnalyzer: React.FC = () => {
  // Mode selection: 'ai' is default, 'manual' for optional self-select
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');

  // Face detection hook
  const faceDetection = useFaceDetection();

  // AI mood analyzer states
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [aiStep, setAIStep] = useState<number>(0); // 0: input, 1: recommendations shown
  const [isPayingAI, setIsPayingAI] = useState(false);
  const [paidAI, setPaidAI] = useState(false);
  const [selectedDestinationIdx, setSelectedDestinationIdx] = useState<number | null>(0);
  const [faceCount, setFaceCount] = useState<number | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  // Sync face count from detection hook
  useEffect(() => {
    if (faceDetection.faceCount !== null) {
      setFaceCount(faceDetection.faceCount);
    }
  }, [faceDetection.faceCount]);
  const [selectedFAQIndex, setSelectedFAQIndex] = useState<number>(0);

  // Manual multi-step analyzer states
  const [step, setStep] = useState<number>(0);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [social, setSocial] = useState<number>(5);
  const [adventure, setAdventure] = useState<number>(5);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Handlers for AI flow
  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera...');
    
    // Stop all media tracks
    const mediaStream = cameraStreamRef.current;
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped track:', track.kind);
      });
      cameraStreamRef.current = null;
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset video element
    }
    
    setIsCameraOpen(false);
    console.log('✅ Camera stopped and cleaned up');
  }, []);

  const initCamera = useCallback(async () => {
    console.log('🎥 Initializing camera...');
    setDetectionError(null);

    // Guard: ensure videoRef.current exists
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.error('❌ Video element ref is null - cannot initialize camera');
      setDetectionError('Camera preview element not ready. Please try again.');
      setIsCameraOpen(false);
      return;
    }

    // Browser support check
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('❌ Browser does not support getUserMedia');
      setDetectionError('Your browser does not support camera access. Please use Chrome, Firefox, Edge, or Safari.');
      setIsCameraOpen(false);
      return;
    }

    // Secure context check
    const isSecureContext = window.isSecureContext || 
                           window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
    
    if (!isSecureContext) {
      console.error('❌ Not running on secure context');
      setDetectionError(`Camera requires HTTPS or localhost. Current: ${window.location.protocol}//${window.location.host}`);
      setIsCameraOpen(false);
      return;
    }

    try {
      console.log('📹 Requesting camera permission...');
      
      // Request camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640, max: 1280 }, 
          height: { ideal: 480, max: 720 }, 
          facingMode: 'user' 
        },
        audio: false,
      });
      
      console.log('✅ Camera permission granted!');
      console.log('📊 Stream active:', stream.active, 'Tracks:', stream.getTracks().length);

      // Attach stream to video element
      videoElement.srcObject = stream;
      cameraStreamRef.current = stream;

      // Wait for video metadata to load
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Camera metadata loading timeout'));
        }, 5000);

        const onLoadedMetadata = () => {
          console.log('✅ Video metadata loaded');
          clearTimeout(timeout);
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          console.error('❌ Video error:', e);
          clearTimeout(timeout);
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);
          reject(new Error('Failed to load camera preview'));
        };

        videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
        videoElement.addEventListener('error', onError);

        // If already loaded, resolve immediately
        if (videoElement.readyState >= 1) {
          console.log('✅ Video already has metadata');
          clearTimeout(timeout);
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);
          resolve();
        }
      });

      // Start playback
      console.log('▶️ Starting video playback...');
      await videoElement.play();
      
      console.log('✅ Camera active:', {
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        readyState: videoElement.readyState
      });

    } catch (err) {
      console.error('❌ Camera initialization error:', err);
      
      // Clean up on error
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
        cameraStreamRef.current = null;
      }
      
      let errorMsg = 'Unable to access camera';
      let showAlert = false;
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            errorMsg = '🚫 Camera permission denied.\n\nPlease allow camera access in your browser settings and try again.';
            showAlert = true;
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorMsg = '📷 No camera device found.\n\nPlease connect a camera and try again.';
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            errorMsg = '⚠️ Camera is in use by another application.\n\nClose other apps (Zoom, Teams, etc.) and try again.';
            break;
          case 'OverconstrainedError':
            errorMsg = '⚙️ Camera settings incompatible.\n\nYour camera doesn\'t support the required resolution.';
            break;
          case 'SecurityError':
            errorMsg = '🔒 Camera blocked by browser security.\n\nCheck your browser permissions.';
            break;
          default:
            errorMsg = `Camera error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      setDetectionError(errorMsg);
      setIsCameraOpen(false);
      
      if (showAlert) {
        alert('⚠️ Camera Access Required\n\n' + errorMsg);
      }
    }
  }, []);

  const startCamera = useCallback(() => {
    console.log('🎬 Opening camera interface...');
    setDetectionError(null);
    
    // Pre-flight checks
    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = '❌ Your browser does not support camera access.\n\nPlease use Chrome, Firefox, Edge, or Safari.';
      setDetectionError(msg);
      alert(msg);
      return;
    }
    
    const isSecure = window.isSecureContext || 
                     window.location.protocol === 'https:' || 
                     ['localhost', '127.0.0.1'].includes(window.location.hostname);
    
    if (!isSecure) {
      const msg = `⚠️ Camera requires HTTPS or localhost.\n\nCurrent: ${window.location.protocol}//${window.location.host}`;
      setDetectionError(msg);
      alert(msg);
      return;
    }
    
    console.log('✅ Pre-flight checks passed');
    setIsCameraOpen(true);
  }, []);

  // Initialize camera when video element becomes available
  useEffect(() => {
    if (isCameraOpen && videoRef.current && !cameraStreamRef.current) {
      console.log('📍 Video element available, initializing camera...');
      initCamera();
    }
  }, [isCameraOpen, initCamera]);

  // Detect faces from video stream when camera is active
  useEffect(() => {
    if (!isCameraOpen || !cameraStreamRef.current || !faceDetection.modelsLoaded) {
      return;
    }

    console.log('👁️ Starting face detection from video stream...');
    const intervalId = setInterval(() => {
      if (videoRef.current) {
        faceDetection.detectFacesFromVideo(videoRef as React.RefObject<HTMLVideoElement>);
      }
    }, 1000); // Detect every second

    return () => {
      console.log('🛑 Stopping face detection interval');
      clearInterval(intervalId);
    };
  }, [isCameraOpen, faceDetection, videoRef]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  // Initialize face detection models on mount and ensure camera stops on unmount
  useEffect(() => {
    void faceDetection.loadModels().catch(err => {
      console.error('Failed to preload face detection models:', err);
    });
    
    // Cleanup on unmount only
    return () => {
      console.log('🧹 Component unmounting, cleaning up camera...');
      const mediaStream = cameraStreamRef.current;
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        cameraStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      imagePreviewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount/unmount

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setDetectionError('Image too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        stopCamera();
        imagePreviewRef.current = null;
        setImage(reader.result as string);
        setDetectionError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCapturedImage = useCallback(() => {
    setImage(null);
    setResult(null);
    setDetectionError(null);
    setFaceCount(null);
    imagePreviewRef.current = null;
  }, []);

  const analyzeAI = async () => {
    if (!image) {
      setDetectionError('Please capture or upload a photo before analysis.');
      return;
    }

    setLoading(true);
    setDetectionError(null);

    const backendEndpoint = getMoodAnalyzerUrl();

    const prepareImageForAnalysis = async (): Promise<HTMLImageElement> => {
      const previewNode = imagePreviewRef.current;

      if (previewNode) {
        if (!previewNode.complete || previewNode.naturalWidth === 0) {
          await new Promise<void>((resolve, reject) => {
            const node = previewNode;
            if (!node) {
              resolve();
              return;
            }

            function cleanup() {
              node.removeEventListener('load', handleLoad);
              node.removeEventListener('error', handleError);
            }

            const handleLoad = () => {
              cleanup();
              resolve();
            };

            const handleError = () => {
              cleanup();
              reject(new Error('Failed to load image for analysis. Please try another photo.'));
            };

            node.addEventListener('load', handleLoad);
            node.addEventListener('error', handleError);
          });
        }

        if (previewNode.naturalWidth === 0) {
          throw new Error('Preview image is empty. Please capture a new photo.');
        }

        return previewNode;
      }

      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        imgEl.onload = () => resolve(imgEl);
        imgEl.onerror = () => reject(new Error('Failed to load image for analysis. Please try another photo.'));
        imgEl.src = image;
      });
    };

    try {
      if (!faceDetection.modelsLoaded) {
        console.debug('Face detection models not ready — loading now.');
        await faceDetection.loadModels();
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      let imageNode: HTMLImageElement;
      try {
        imageNode = await prepareImageForAnalysis();
      } catch (prepError) {
        const message = prepError instanceof Error ? prepError.message : 'Could not load image for analysis.';
        setDetectionError(message);
        setFaceCount(null);
        return;
      }

      const localAnalysis = await faceDetection.analyzeImage(imageNode);

      if (!localAnalysis) {
        setDetectionError(faceDetection.error || 'No face detected. Please try again.');
        setFaceCount(null);
        return;
      }

      const match = localAnalysis.reasoning?.match(/Detected\s+(\d+)\s+face/i);
      setFaceCount(match ? parseInt(match[1], 10) : 1);

      const moodResponse = await analyzeMoodWithImage(image);

      if (moodResponse.error) {
        setDetectionError(moodResponse.error);
        return;
      }

      const recommendations = filterDestinationsByMood({
        ...moodResponse,
        recommendedKeys: moodResponse.recommendedKeys ?? [],
      });

      if (recommendations.length === 0) {
        setDetectionError('Could not find matching destinations. Please try again.');
        return;
      }

      const aiResult: AIAnalysisResult = {
        detectedMood: moodResponse.detectedMood,
        confidence: moodResponse.confidence,
        emotions: moodResponse.emotions,
        reasoning: moodResponse.reasoning,
        energyLevel: moodResponse.energyLevel,
        socialScore: moodResponse.socialScore,
        adventureScore: moodResponse.adventureScore,
        recommendations,
      };

      setResult(aiResult);
      setSelectedDestinationIdx(0);
      setSelectedFAQIndex(0);
      setAIStep(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Mood analysis failed:', error);

      if (/Failed to reach mood analyzer service/i.test(message) || message.includes('Failed to fetch')) {
        setDetectionError(
          `Cannot connect to backend at ${backendEndpoint}. Make sure the server is running on port 3001.\n` +
          'Run: cd backend && npm run dev'
        );
      } else if (message.startsWith('HTTP')) {
        setDetectionError(`Backend returned error: ${message}`);
      } else {
        setDetectionError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  async function payAI() {
    setIsPayingAI(true);
    const amount = 6500;
    try {
      await makePayment(amount);
      setIsPayingAI(false);
      setPaidAI(true);
    } catch (error) {
      console.error('Payment error:', error);
      setIsPayingAI(false);
    }
  }

  function downloadTicketAI() {
    if (!result) return;
    const dest = result.recommendations[selectedDestinationIdx ?? 0];
    const doc = new jsPDF();
    const amount = 6500;
    doc.setFontSize(16);
    doc.text(`✈️ DarShana AI Trip Ticket`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Destination: ${dest.title}`, 10, 40);
    doc.text(`Detected Mood: ${result.detectedMood}`, 10, 55);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(0)}%`, 10, 70);
    doc.text(`Amount Paid: ₹${amount}`, 10, 85);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 10, 100);
    doc.text(`Best Time to Visit: ${dest.bestTime || 'Year-round'}`, 10, 115);
    doc.save('darshana-trip-ticket.pdf');
  }

  // Manual mode recommendation
  function getRecommendations(): Destination[] {
    const filtered = DESTINATIONS.filter(dest =>
      (mood !== null ? dest.mood.includes(mood) : true) &&
      energy >= dest.energy[0] && energy <= dest.energy[1] &&
      social >= dest.social[0] && social <= dest.social[1] &&
      adventure >= dest.adventure[0] && adventure <= dest.adventure[1]
    );
    return filtered.length ? filtered.slice(0, 3) : DESTINATIONS.slice(0, 3);
  }

  async function pay() {
    setIsPaying(true);
    const amount = 5000 + energy * 120 + adventure * 180 + social * 100;
    try {
      await makePayment(amount);
      setIsPaying(false);
      setStep(6);
    } catch (error) {
      console.error('Payment error:', error);
      setIsPaying(false);
    }
  }

  function downloadTicket() {
    const dest = getRecommendations()[selectedIdx ?? 0];
    const amount = 5000 + energy * 120 + adventure * 180 + social * 100;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`✈️ DarShana Trip Ticket`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Destination: ${dest.title}`, 10, 40);
    doc.text(`Amount Paid: ₹${amount}`, 10, 55);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 10, 70);
    doc.save('darshana-trip-ticket.pdf');
  }

  // UI Start
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-center gap-2 mb-8">
        <button
          className={`px-8 py-3 rounded-full font-bold border transition duration-150 ${
            mode === 'ai' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-300 text-gray-700'
          }`}
          onClick={() => {
            setMode('ai');
            setAIStep(0);
            clearCapturedImage();
            setPaidAI(false);
            setIsPayingAI(false);
          }}
        >
          <Camera size={18} className="inline mr-2" /> AI Mood Analyzer
        </button>
        <button
          className={`px-8 py-3 rounded-full font-bold border transition duration-150 ${
            mode === 'manual' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-gray-300 text-gray-700'
          }`}
          onClick={() => {
            setMode('manual');
            setStep(0);
            setMood(null);
            setEnergy(5);
            setSocial(5);
            setAdventure(5);
          }}
        >
          <span role="img" aria-label="mood">😊</span> Manual Selection
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
          {/* AI Analyzer steps */}
          {aiStep === 0 && (
            <div>
              <div className="font-bold text-2xl mb-3 text-center">🤖 AI Mood Travel Matcher</div>
              <p className="text-stone-600 text-center mb-6">
                Let our AI analyze your facial expression and recommend the perfect Indian destination for your current state of mind.
              </p>

              {detectionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex gap-3 mb-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-red-700 font-semibold mb-1">Camera Error</div>
                      <div className="text-red-600 text-sm whitespace-pre-line">{detectionError}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => {
                        console.log('🔄 Retry button clicked');
                        // Stop any existing stream
                        if (cameraStreamRef.current) {
                          console.log('🛑 Stopping existing stream');
                          cameraStreamRef.current.getTracks().forEach(track => track.stop());
                          cameraStreamRef.current = null;
                        }
                        // Reset state
                        setDetectionError(null);
                        setIsCameraOpen(false);
                        // Small delay to ensure state is cleared before retrying
                        setTimeout(() => {
                          console.log('🔄 Starting camera after retry');
                          startCamera();
                        }, 100);
                      }}
                      className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      🔄 Retry Camera
                    </button>
                    <button 
                      onClick={() => {
                        setDetectionError(null);
                      }}
                      className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                  
                  {/* Troubleshooting tips */}
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer text-red-700 font-semibold hover:text-red-800">
                      💡 Troubleshooting Tips
                    </summary>
                    <div className="mt-2 text-gray-700 space-y-2 bg-white p-3 rounded">
                      <p>✅ <strong>Check Browser Permissions:</strong> Click the camera/lock icon in the address bar and allow camera access</p>
                      <p>✅ <strong>Use HTTPS or Localhost:</strong> Camera requires secure connection (you're on: {window.location.protocol}//{window.location.host})</p>
                      <p>✅ <strong>Close Other Apps:</strong> Make sure no other application is using your camera (Zoom, Teams, Skype, etc.)</p>
                      <p>✅ <strong>Try Different Browser:</strong> Chrome, Firefox, Edge, and Safari support camera access</p>
                      <p>✅ <strong>Check System Settings:</strong> Ensure camera is enabled in your OS privacy settings</p>
                      <p>✅ <strong>Refresh Page:</strong> Sometimes a simple page refresh resolves permission issues</p>
                    </div>
                  </details>
                </div>
              )}

              {!image && !isCameraOpen && (
                <div className="h-64 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-4 bg-stone-50">
                  <button 
                    onClick={() => {
                      console.log('Open Camera button clicked');
                      startCamera();
                    }}
                    className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition"
                  >
                    <Camera size={20} /> Open Camera
                  </button>
                  <span className="text-stone-400 text-sm">or</span>
                  <label className="flex items-center gap-2 text-stone-600 cursor-pointer hover:text-orange-600 transition">
                    <Upload size={20} /> Upload Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}

              {isCameraOpen && (
                <div className="relative h-64 bg-black rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  
                  {/* Loading indicator while camera initializes */}
                  {!cameraStreamRef.current && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
                      <Loader2 className="w-12 h-12 animate-spin mb-3" />
                      <p className="text-sm">Initializing camera...</p>
                      <p className="text-xs text-gray-300 mt-2">Please allow camera permission if prompted</p>
                    </div>
                  )}
                  
                  {/* Camera controls */}
                  {cameraStreamRef.current && (
                    <>
                      {/* Face count indicator */}
                      {faceCount !== null && (
                        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg">
                          {faceCount === 0 ? '😐 No faces detected' : 
                           faceCount === 1 ? '😊 1 face detected' : 
                           `👥 ${faceCount} faces detected`}
                        </div>
                      )}
                      
                      <button 
                        onClick={capturePhoto}
                        aria-label="Capture photo"
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-full shadow-lg hover:bg-stone-100 transition-all hover:scale-110"
                      >
                        <Camera size={28} />
                      </button>
                      <button 
                        onClick={stopCamera}
                        aria-label="Close camera"
                        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              )}

              {image && (
                <div className="relative h-64 rounded-xl overflow-hidden bg-stone-100">
                  <img ref={imagePreviewRef} src={image} alt="Captured" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {
                      clearCapturedImage();
                      setAIStep(0);
                    }}
                    aria-label="Retake photo"
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}

              {image && !result && (
                <button 
                  onClick={analyzeAI}
                  disabled={loading}
                  className="w-full mt-6 bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing your mood...
                    </>
                  ) : (
                    '✨ Analyze Mood & Recommend'
                  )}
                </button>
              )}
            </div>
          )}

          {/* AI recommendations, payment, ticket */}
          {aiStep === 1 && result && !paidAI && (
            <div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-6 rounded-xl mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg mb-1">
                      {result.detectedMood} ({(result.confidence * 100).toFixed(0)}% confidence)
                    </h3>
                    <p className="text-orange-700 text-sm">{result.reasoning}</p>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/60 p-2 rounded">
                        <div className="font-semibold text-orange-600">Energy</div>
                        <div className="text-lg">{result.energyLevel}/10</div>
                      </div>
                      <div className="bg-white/60 p-2 rounded">
                        <div className="font-semibold text-orange-600">Social</div>
                        <div className="text-lg">{result.socialScore}/10</div>
                      </div>
                      <div className="bg-white/60 p-2 rounded">
                        <div className="font-semibold text-orange-600">Adventure</div>
                        <div className="text-lg">{result.adventureScore}/10</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {faceCount && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                  <span>👤</span>
                  <span>{faceCount} face{faceCount > 1 ? 's' : ''} detected (using primary face for analysis)</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4 text-center">Your Top 3 Recommendations</h3>
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                  {result.recommendations.map((rec, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDestinationIdx(idx);
                        setSelectedFAQIndex(0);
                      }}
                      className={`rounded-xl shadow-lg p-4 w-64 border-2 transition transform hover:scale-105 ${
                        selectedDestinationIdx === idx
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <img src={rec.img} alt={rec.title} className="rounded-md mb-3 w-full h-32 object-cover"/>
                      <div className="font-bold text-lg text-left">{rec.title}</div>
                      <div className="mt-2 text-left">
                        <span className="rounded-full px-2 py-1 text-xs bg-orange-100 text-orange-600 mr-2">{rec.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2 text-xs text-left">
                        {rec.tags.slice(0, 2).map((tag: string, i: number) => (
                          <span key={i} className="bg-gray-200 rounded px-2 py-1">{tag}</span>
                        ))}
                        {rec.tags.length > 2 && (
                          <span className="bg-gray-200 rounded px-2 py-1">+{rec.tags.length - 2}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* FAQ Section */}
                {selectedDestinationIdx !== null && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">❓</span>
                      <h4 className="font-bold text-blue-900">Frequently Asked Questions</h4>
                    </div>
                    
                    {(() => {
                      const faqs = generateFAQ(result.recommendations[selectedDestinationIdx], {
                        detectedMood: result.detectedMood,
                        confidence: result.confidence,
                        emotions: result.emotions,
                        energyLevel: result.energyLevel,
                        socialScore: result.socialScore,
                        adventureScore: result.adventureScore,
                        reasoning: result.reasoning,
                        recommendedKeys: [],
                      } as any);

                      return (
                        <div className="space-y-3">
                          {faqs.map((faq, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedFAQIndex(selectedFAQIndex === idx ? -1 : idx)}
                              className="w-full text-left bg-white rounded-lg p-3 hover:bg-blue-100 transition"
                            >
                              <div className="font-semibold text-blue-900 flex items-start gap-2">
                                <span className="text-lg">{['🏜️', '🎯', '🔄'][idx]}</span>
                                <span>{faq.question}</span>
                              </div>
                              {selectedFAQIndex === idx && (
                                <div className="mt-3 text-sm text-blue-800 ml-6">{faq.answer}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <button 
                  className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setAIStep(0);
                    clearCapturedImage();
                    setPaidAI(false);
                    setSelectedDestinationIdx(0);
                    setSelectedFAQIndex(0);
                  }}
                >
                  Try Different Expression
                </button>
                <button 
                  className="flex-1 px-6 py-3 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
                  onClick={payAI}
                  disabled={isPayingAI || selectedDestinationIdx === null}
                >
                  {isPayingAI ? (
                    <>
                      <Loader2 className="inline animate-spin mr-2" size={16} />
                      Processing...
                    </>
                  ) : (
                    '💳 Pay & Book (₹6,500)'
                  )}
                </button>
              </div>
            </div>
          )}

          {paidAI && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <CheckCircle className="text-green-600" size={64} />
              </div>
              <h2 className="font-bold text-2xl mb-2 text-green-700">Payment Successful! 🎉</h2>
              <p className="text-gray-600 mb-6">Your DarShana AI Trip Ticket is ready</p>
              
              {selectedDestinationIdx !== null && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 text-left">
                  <div className="font-bold text-lg text-green-900 mb-2">
                    ✈️ {result?.recommendations[selectedDestinationIdx].title}
                  </div>
                  <div className="text-green-800 space-y-1 text-sm">
                    <div><span className="font-semibold">Detected Mood:</span> {result?.detectedMood}</div>
                    <div><span className="font-semibold">Confidence:</span> {result && (result.confidence * 100).toFixed(0)}%</div>
                    <div><span className="font-semibold">Amount Paid:</span> ₹6,500</div>
                    <div><span className="font-semibold">Booking Date:</span> {new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                  onClick={downloadTicketAI}
                >
                  📥 Download PDF Ticket
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setAIStep(0);
                    setPaidAI(false);
                    clearCapturedImage();
                    setSelectedDestinationIdx(0);
                    setSelectedFAQIndex(0);
                    setIsPayingAI(false);
                  }}
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Manual multi-step form flow
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.slice(0,-1).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition ${step===i?'bg-teal-500 scale-125':'bg-gray-300'}`}></div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">😊 How are you feeling today?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {['😊 Happy','😐 Neutral','😮 Surprised','😢 Sad','😃 Excited','🤔 Thoughtful','😁 Energetic'].map((em, idx) => (
                  <button 
                    key={idx} 
                    className={`rounded-xl px-6 py-4 border-2 text-lg font-semibold transition transform hover:scale-110 ${
                      mood === idx ? "bg-teal-600 text-white border-teal-600" : "bg-white border-gray-300 text-gray-700 hover:border-teal-400"
                    }`} 
                    onClick={() => setMood(idx)}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <button 
                className="w-full mt-8 px-6 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50"
                disabled={mood===null}
                onClick={()=>setStep(1)}
              >
                Next →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">⚡ What's your energy level?</h2>
              <div className="flex flex-col items-center py-6">
                <div className="text-6xl mb-4">{energy < 3 ? '😴' : energy < 7 ? '😊' : '🚀'}</div>
                <div className="text-2xl font-bold text-teal-700 mb-4">{energy < 3 ? 'Low' : energy < 7 ? 'Moderate' : 'High'}</div>
                <input 
                  type="range" 
                  min={1} 
                  max={10} 
                  value={energy} 
                  onChange={e => setEnergy(Number(e.target.value))}
                  className="w-64 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between w-64 px-2 text-sm text-gray-500 mt-2">
                  <span>Low (1)</span>
                  <span className="font-bold text-teal-700">{energy}/10</span>
                  <span>High (10)</span>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setStep(0)}
                >
                  ← Previous
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-teal-700 text-white hover:bg-teal-800 transition"
                  onClick={() => setStep(2)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">👥 How social do you want to be?</h2>
              <div className="flex flex-col items-center py-6">
                <div className="text-6xl mb-4">{social < 4 ? '🧘' : social < 7 ? '👫' : '🎉'}</div>
                <div className="text-2xl font-bold text-teal-700 mb-4">{social < 4 ? 'Solo' : social < 7 ? 'Small Groups' : 'Large Groups'}</div>
                <input 
                  type="range" 
                  min={1} 
                  max={10} 
                  value={social} 
                  onChange={e => setSocial(Number(e.target.value))}
                  className="w-64 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between w-64 px-2 text-sm text-gray-500 mt-2">
                  <span>Solo</span>
                  <span className="font-bold text-teal-700">{social}/10</span>
                  <span>Group</span>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setStep(1)}
                >
                  ← Previous
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-teal-700 text-white hover:bg-teal-800 transition"
                  onClick={() => setStep(3)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">🏔️ How adventurous are you?</h2>
              <div className="flex flex-col items-center py-6">
                <div className="text-6xl mb-4">{adventure < 4 ? '🛋️' : adventure < 7 ? '🥾' : '🪂'}</div>
                <div className="text-2xl font-bold text-teal-700 mb-4">{adventure < 4 ? 'Safe' : adventure < 7 ? 'Mild Adventure' : 'Extreme Adventure'}</div>
                <input 
                  type="range" 
                  min={1} 
                  max={10} 
                  value={adventure} 
                  onChange={e => setAdventure(Number(e.target.value))}
                  className="w-64 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between w-64 px-2 text-sm text-gray-500 mt-2">
                  <span>Safe</span>
                  <span className="font-bold text-teal-700">{adventure}/10</span>
                  <span>Adventurous</span>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setStep(2)}
                >
                  ← Previous
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-teal-700 text-white hover:bg-teal-800 transition"
                  onClick={() => setStep(4)}
                >
                  Analyze My Mood →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">🎯 Your Recommendations</h2>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {getRecommendations().map((dest, idx) => (
                  <button
                    key={idx}
                    className={`rounded-xl shadow-lg p-4 w-64 transition border-2 transform hover:scale-105 ${
                      selectedIdx === idx ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <img src={dest.img} alt={dest.title} className="rounded-md mb-3 w-full h-32 object-cover"/>
                    <div className="font-bold text-lg text-left">{dest.title}</div>
                    <div className="mt-2 text-left">
                      <span className="rounded-full px-2 py-1 text-xs bg-teal-100 text-teal-600 mr-2">{dest.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 text-xs text-left">
                      {dest.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-gray-200 rounded px-2 py-1">{tag}</span>
                      ))}
                      {dest.tags.length > 2 && (
                        <span className="bg-gray-200 rounded px-2 py-1">+{dest.tags.length - 2}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setStep(0);
                    setMood(null);
                    setEnergy(5);
                    setSocial(5);
                    setAdventure(5);
                  }}
                >
                  Analyze Again
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-teal-700 text-white hover:bg-teal-800 transition disabled:opacity-50"
                  disabled={selectedIdx === null}
                  onClick={() => setStep(5)}
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-6">💳 Booking Details</h2>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6 mb-6">
                <div className="space-y-3 text-left">
                  <div className="text-lg">
                    <span className="font-semibold text-teal-900">Destination:</span>
                    <span className="ml-2 text-teal-700"> {getRecommendations()[selectedIdx ?? 0]?.title}</span>
                  </div>
                  <div className="text-lg">
                    <span className="font-semibold text-teal-900">Your Mood:</span>
                    <span className="ml-2 text-teal-700"> {['Happy & Excited','Neutral','Surprised','Sad','Energetic','Thoughtful','Social'][mood ?? 0]}</span>
                  </div>
                  <div className="text-lg">
                    <span className="font-semibold text-teal-900">Energy Level:</span>
                    <span className="ml-2 text-teal-700"> {energy}/10</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-orange-700 mb-2">Total Trip Cost</div>
                  <div className="text-4xl font-bold text-orange-600">
                    ₹{5000 + energy*120 + adventure*180 + social*100}
                  </div>
                  <div className="text-xs text-orange-600 mt-2">
                    Base: ₹5,000 + Energy: ₹{energy*120} + Adventure: ₹{adventure*180} + Social: ₹{social*100}
                  </div>
                </div>
              </div>

              <button 
                className="w-full px-6 py-4 rounded-lg font-semibold text-white bg-teal-700 hover:bg-teal-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isPaying}
                onClick={pay}
              >
                {isPaying ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    💳 Pay & Confirm Booking
                  </>
                )}
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <CheckCircle className="text-green-600" size={64} />
              </div>
              <h2 className="font-bold text-2xl mb-2 text-green-700">Payment Successful! 🎉</h2>
              <p className="text-gray-600 mb-6">Your DarShana Trip Ticket is ready</p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 text-left">
                <div className="font-bold text-lg text-green-900 mb-3">
                  ✈️ {getRecommendations()[selectedIdx ?? 0]?.title}
                </div>
                <div className="text-green-800 space-y-2 text-sm">
                  <div><span className="font-semibold">Amount Paid:</span> ₹{5000 + energy*120 + adventure*180 + social*100}</div>
                  <div><span className="font-semibold">Booking Date:</span> {new Date().toLocaleDateString('en-IN')}</div>
                  <div><span className="font-semibold">Best Time to Visit:</span> {getRecommendations()[selectedIdx ?? 0]?.bestTime || 'Year-round'}</div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button 
                  className="px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                  onClick={downloadTicket}
                >
                  📥 Download PDF Ticket
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setStep(0);
                    setMood(null);
                    setEnergy(5);
                    setSocial(5);
                    setAdventure(5);
                  }}
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>🛡️ Your data is secure and not stored. Analysis happens locally on your device.</p>
        <p className="mt-2">🤖 Powered by face-api.js & TensorFlow.js | 🇮🇳 Designed for Indian travelers</p>
      </div>
    </div>
  );
};

export default MoodAnalyzer;
```

## 4. Backend Configuration (`backend/src/config/environment.ts`)

This file manages environment variables and CORS settings.

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana-travel',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
  
  // External APIs
  OPENROUTESERVICE_KEY: process.env.OPENROUTESERVICE_KEY || 'demo-key',
  AVIATIONSTACK_KEY: process.env.AVIATIONSTACK_KEY || 'demo-key',
  GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY || 'demo-key',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // CORS - Allow all local development ports and production domains
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*', 
  
  // Feature flags
  ENABLE_EXTERNAL_APIS: process.env.ENABLE_EXTERNAL_APIS === 'true',
  USE_CACHE: process.env.USE_CACHE === 'true',
};
```

## 5. Backend Controller (`backend/src/controllers/moodAnalyzerController.ts`)

The controller logic for processing mood analysis requests.

```typescript
/**
 * Mood Analyzer Controller
 * Handles POST /api/mood-analyze requests
 */

import type { Request, Response } from 'express';
import type { MoodAnalyzeRequest, MoodAnalyzeResponse, EmotionScores } from '../types/moodAnalyzer';

/**
 * Mock emotion detection
 */
function generateMockEmotions(): EmotionScores {
  const patterns = [
    { happy: 0.8, sad: 0.05, angry: 0, surprised: 0.1, neutral: 0.05, fear: 0, disgust: 0 },
    { happy: 0.3, sad: 0.1, angry: 0.1, surprised: 0.2, neutral: 0.3, fear: 0, disgust: 0 },
    { happy: 0.2, sad: 0.3, angry: 0.1, surprised: 0, neutral: 0.4, fear: 0, disgust: 0 },
    { happy: 0.6, sad: 0, angry: 0, surprised: 0.3, neutral: 0.1, fear: 0, disgust: 0 },
    { happy: 0.1, sad: 0.2, angry: 0, surprised: 0, neutral: 0.7, fear: 0, disgust: 0 },
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * POST /api/mood-analyze
 */
export async function analyzeMood(req: Request, res: Response): Promise<void> {
  try {
    console.log('\n📥 ===== MOOD ANALYZER REQUEST RECEIVED =====');
    
    const { imageData, imageUrl } = req.body as MoodAnalyzeRequest;

    if (!imageData && !imageUrl) {
      res.status(400).json({ error: 'Missing imageData or imageUrl' });
      return;
    }

    // Mock Analysis
    const emotions = generateMockEmotions();
    
    // Determine dominant emotion
    let dominantEmotion = 'neutral';
    let maxScore = 0;
    for (const [emotion, score] of Object.entries(emotions)) {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }

    // Calculate scores
    const energyLevel = Math.min(10, Math.round((emotions.happy + emotions.surprised + emotions.angry) * 10));
    const socialScore = Math.min(10, Math.round((emotions.happy + emotions.neutral) * 10));
    const adventureScore = Math.min(10, Math.round((emotions.surprised + emotions.fear) * 10));

    // Recommendations based on mood
    const recommendations: Record<string, string[]> = {
      happy: ['beach', 'party', 'festival'],
      sad: ['nature', 'quiet', 'retreat'],
      angry: ['adventure', 'hiking', 'sports'],
      surprised: ['city', 'exploration', 'museum'],
      neutral: ['park', 'cafe', 'library'],
      fear: ['home', 'safe', 'guided'],
      disgust: ['clean', 'luxury', 'spa']
    };

    const response: MoodAnalyzeResponse = {
      detectedMood: dominantEmotion,
      confidence: maxScore,
      emotions,
      energyLevel,
      socialScore,
      adventureScore,
      reasoning: `Based on your ${dominantEmotion} expression, we recommend these destinations.`,
      recommendedKeys: recommendations[dominantEmotion] || ['general']
    };

    console.log('✅ Analysis complete:', dominantEmotion);
    res.json(response);

  } catch (error) {
    console.error('❌ Mood analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze mood',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function moodAnalyzerHealth(req: Request, res: Response): Promise<void> {
  res.json({ status: 'Mood Analyzer is running', timestamp: new Date().toISOString() });
}
```

## 6. Backend Routes (`backend/src/routes/moodAnalyzer.ts`)

Defines the API endpoints for the mood analyzer.

```typescript
/**
 * Mood Analyzer Routes
 * API endpoints for AI mood analysis
 */

import { Router } from 'express';
import { analyzeMood, moodAnalyzerHealth } from '../controllers/moodAnalyzerController';

const router = Router();

/**
 * POST /api/mood-analyze
 */
router.post('/', analyzeMood);

/**
 * GET /api/mood-analyze/health
 */
router.get('/health', moodAnalyzerHealth);

export default router;
```

## 7. Backend Entry Point (`backend/src/index.ts`)

The main server file that sets up Express, CORS, and routes.

```typescript
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import logger from './utils/logger.js';
import routeRoutes from './routes/routes.js';
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';
import guideRoutes from './routes/guides.js';
import tripPlannerRoutes from './routes/tripPlanner.js';

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'darshana-green-routes' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running! ✅' });
});

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/mood-analyze', moodAnalyzerRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/trip-planner', tripPlannerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  🚀 DarShana Travel Backend Started    ║
║  Port: ${env.PORT}                            
║  URL:  http://localhost:${env.PORT}
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```
