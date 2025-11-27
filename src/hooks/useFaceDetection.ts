/**
 * useFaceDetection Hook
 * Handles face-api.js model loading and emotion detection from video/image
 *
 * Usage:
 * const { loading, analyzeFromVideo, analyzeFromImage } = useFaceDetection();
 * const faces = await analyzeFromImage(base64ImageData);
 */

import { useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import type { DetectedFace, UseFaceDetectionReturn } from '../types/moodAnalyzer';

const MODELS_PATH = '/models'; // Path to face-api.js model files in public folder

export function useFaceDetection(): UseFaceDetectionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modelsLoaded = useRef(false);

  /**
   * Load all required face-api.js models
   * These files should be in public/models/
   */
  const loadModels = async () => {
    if (modelsLoaded.current) return;

    try {
      setLoading(true);
      setError(null);

      // Load the SSD Mobilenet v1 model for face detection
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH);

      // Load the face landmark detector
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH);

      // Load the face expression detector (emotion detection)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODELS_PATH);

      modelsLoaded.current = true;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load face detection models';
      setError(errorMsg);
      console.error('Model loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Analyze emotion from a video element (live camera)
   * @param videoElement The video element streaming from camera
   * @returns Array of detected faces with emotion scores
   */
  const analyzeFromVideo = async (videoElement: HTMLVideoElement): Promise<DetectedFace[] | null> => {
    try {
      if (!modelsLoaded.current) await loadModels();

      // Detect all faces and their expressions
      const detections = await faceapi
        .detectAllFaces(videoElement)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length === 0) {
        setError('No face detected. Please face the camera.');
        return null;
      }

      // Convert detections to our DetectedFace format
      const faces: DetectedFace[] = detections.map((detection) => {
        const exprs = detection.expressions;
        return {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
          emotions: {
            happy: exprs.happy || 0,
            sad: exprs.sad || 0,
            angry: exprs.angry || 0,
            surprised: exprs.surprised || 0,
            neutral: exprs.neutral || 0,
            fear: 0,
            disgust: 0,
          },
          confidence: detection.detection.score,
        };
      });

      setError(null);
      return faces;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Face detection failed';
      setError(errorMsg);
      console.error('Video analysis error:', err);
      return null;
    }
  };

  /**
   * Analyze emotion from a static image (uploaded or captured)
   * @param imageData Base64 encoded image data or image URL
   * @returns Array of detected faces with emotion scores
   */
  const analyzeFromImage = async (imageData: string): Promise<DetectedFace[] | null> => {
    try {
      if (!modelsLoaded.current) await loadModels();

      // Create an image element
      const img = new Image();

      // Handle CORS for remote images
      img.crossOrigin = 'anonymous';

      // Load the image
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageData;
      });

      // Detect all faces and their expressions
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length === 0) {
        setError('No face detected in the image.');
        return null;
      }

      // Convert detections to our DetectedFace format
      const faces: DetectedFace[] = detections.map((detection) => {
        const exprs = detection.expressions;
        return {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
          emotions: {
            happy: exprs.happy || 0,
            sad: exprs.sad || 0,
            angry: exprs.angry || 0,
            surprised: exprs.surprised || 0,
            neutral: exprs.neutral || 0,
            fear: 0,
            disgust: 0,
          },
          confidence: detection.detection.score,
        };
      });

      setError(null);
      return faces;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Image analysis failed';
      setError(errorMsg);
      console.error('Image analysis error:', err);
      return null;
    }
  };

  return {
    loading,
    error,
    analyzeFromVideo,
    analyzeFromImage,
    loadModels,
  };
}
