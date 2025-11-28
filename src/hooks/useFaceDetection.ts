/**
 * useFaceDetection Hook
 * Handles face-api.js model loading and emotion detection from video/image
 *
 * Usage:
 * const { loading, analyzeFromVideo, analyzeFromImage } = useFaceDetection();
 * const faces = await analyzeFromImage(base64ImageData);
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import type {
  DetectedFace,
  EmotionScores,
  AIAnalysisResult,
} from '../types/moodAnalyzer';

const MODELS_PATH = '/models'; // Must point to `public/models` when built with Vite

type AnalysisResult = AIAnalysisResult;

export interface UseFaceDetectionReturnV2 {
  loadingModels: boolean;
  modelsLoaded: boolean;
  error: string | null;
  analyzeImage: (
    image: HTMLImageElement | HTMLVideoElement
  ) => Promise<AnalysisResult | null>;
  analyzeFromImage: (
    imageDataUrl: string
  ) => Promise<AnalysisResult | null>;
  analyzeFromVideo: (
    video: HTMLVideoElement
  ) => Promise<AnalysisResult | null>;
  // expose a manual loader for advanced usage
  loadModels: () => Promise<void>;
}

/**
 * useFaceDetection
 * - Loads models from `/models` (public folder)
 * - Exposes `modelsLoaded` and `loadingModels` flags
 * - Exposes `analyzeImage` which waits for models and runs detection
 *
 * Notes:
 * - Ensure all model files (the *.bin and *weights_manifest.json) are present in `public/models`.
 * - In production the `/models` path must resolve to those files (Vite serves public/ at root).
 */
export function useFaceDetection(): UseFaceDetectionReturnV2 {
  const [loadingModels, setLoadingModels] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadOnceRef = useRef<boolean>(false);

  const loadModels = useCallback(async (): Promise<void> => {
    if (loadOnceRef.current) return;
    setLoadingModels(true);
    setError(null);

    try {
      // Check if backend is already initialized to avoid context loss
      // @ts-ignore
      const currentBackend = faceapi.tf.getBackend();
      if (currentBackend === 'webgl' || currentBackend === 'cpu') {
        console.log(`TensorFlow.js backend already active: ${currentBackend}`);
      } else {
        // Try WebGL first for performance, fallback to CPU if it fails
        try {
          console.log('Attempting to set TensorFlow.js backend to WebGL...');
          // @ts-ignore
          await faceapi.tf.setBackend('webgl');
          // @ts-ignore
          await faceapi.tf.ready();
          // @ts-ignore
          console.log('✓ TensorFlow.js backend:', faceapi.tf.getBackend());
        } catch (webglError) {
          console.warn('WebGL backend failed, falling back to CPU...', webglError);
          // @ts-ignore
          await faceapi.tf.setBackend('cpu');
          // @ts-ignore
          await faceapi.tf.ready();
          // @ts-ignore
          console.log('✓ TensorFlow.js backend (fallback):', faceapi.tf.getBackend());
        }
      }

      // Load each model with its own try/catch so we can report corrupt/partial downloads
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded ssdMobilenetv1');
      } catch (err) {
        console.error('Failed to load ssdMobilenetv1 from', MODELS_PATH, err);
        throw new Error('ssdMobilenetv1 failed to load');
      }

      try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded faceLandmark68Net');
      } catch (err) {
        console.error('Failed to load faceLandmark68Net from', MODELS_PATH, err);
        throw new Error('faceLandmark68Net failed to load');
      }

      try {
        await faceapi.nets.faceExpressionNet.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded faceExpressionNet');
      } catch (err) {
        console.error('Failed to load faceExpressionNet from', MODELS_PATH, err);
        throw new Error('faceExpressionNet failed to load');
      }

      // If we reach here, all models loaded successfully
      loadOnceRef.current = true;
      setModelsLoaded(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Models could not be loaded';
      setError(
        `${message}. Models could not be loaded. Check that all .bin and manifest files are present in public/models and not corrupted.`
      );
      setModelsLoaded(false);
      console.error('Model loading error:', err);
      // rethrow so callers can handle if needed
      throw err;
    } finally {
      setLoadingModels(false);
    }
  }, []);

  // Auto-load models on mount (runs once)
  useEffect(() => {
    // load in background but don't block render; analyzeImage will await if needed
    void loadModels().catch(() => {
      /* error already set in loadModels */
    });
  }, [loadModels]);

  // Helper to normalize face-api detection -> DetectedFace
  const toDetectedFace = (d: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>>): DetectedFace => {
    const box = d.detection.box;
    const exprs = d.expressions as unknown as Record<string, number>;
    const emotions: EmotionScores = {
      happy: exprs.happy ?? 0,
      sad: exprs.sad ?? 0,
      angry: exprs.angry ?? 0,
      surprised: exprs.surprised ?? 0,
      neutral: exprs.neutral ?? 0,
      fear: exprs.fear ?? 0,
      disgust: exprs.disgust ?? 0,
    };

    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      emotions,
      confidence: d.detection.score,
    };
  };

  /**
   * analyzeImage
   * - Accepts an `HTMLImageElement` or `HTMLVideoElement`.
   * - Waits for models to be loaded; if models failed to load, returns null.
   * - Returns an aggregated AIAnalysisResult or null on failure.
   */
  const analyzeImage = useCallback(async (image: HTMLImageElement | HTMLVideoElement): Promise<AnalysisResult | null> => {
    try {
      // Ensure models are loaded before trying to detect
      if (!modelsLoaded) {
        console.log('Models not loaded, loading now...');
        await loadModels();
      }

      if (!modelsLoaded) {
        // Still not loaded after attempt
        setError('Models failed to load. Please refresh the page.');
        return null;
      }

      // Detect faces with expressions
      console.log('Detecting faces...');
      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        setError('No face detected. Please try another image or angle.');
        return null;
      }

      console.log(`Detected ${detections.length} face(s)`);
      const faces = detections.map(toDetectedFace);

      // Aggregate emotions across detected faces (mean)
      const agg: EmotionScores = faces.reduce(
        (acc, f) => {
          acc.happy += f.emotions.happy;
          acc.sad += f.emotions.sad;
          acc.angry += f.emotions.angry;
          acc.surprised += f.emotions.surprised;
          acc.neutral += f.emotions.neutral;
          acc.fear += f.emotions.fear;
          acc.disgust += f.emotions.disgust;
          return acc;
        },
        { happy: 0, sad: 0, angry: 0, surprised: 0, neutral: 0, fear: 0, disgust: 0 }
      );

      const facesCount = faces.length;
      const emotionsMean: EmotionScores = {
        happy: agg.happy / facesCount,
        sad: agg.sad / facesCount,
        angry: agg.angry / facesCount,
        surprised: agg.surprised / facesCount,
        neutral: agg.neutral / facesCount,
        fear: agg.fear / facesCount,
        disgust: agg.disgust / facesCount,
      };

      // Choose top emotion
      const topEmotion = Object.entries(emotionsMean).sort((a, b) => b[1] - a[1])[0];
      const detectedMood = topEmotion ? `${topEmotion[0]}` : 'neutral';

      const result: AnalysisResult = {
        detectedMood,
        confidence: faces.reduce((s, f) => s + f.confidence, 0) / facesCount,
        emotions: emotionsMean,
        reasoning: `Detected ${facesCount} face(s); top emotion: ${detectedMood}`,
        energyLevel: Math.round((emotionsMean.happy - emotionsMean.sad + 1) * 5),
        socialScore: Math.round((emotionsMean.happy + emotionsMean.neutral) * 5),
        adventureScore: Math.round((emotionsMean.surprised + emotionsMean.happy) * 5),
        recommendations: [],
      };

      setError(null);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Face detection failed';
      setError(message);
      console.error('analyzeImage error:', err);
      return null;
    }
  }, [error, loadModels, modelsLoaded]);

  /**
   * analyzeFromImage
   * - Accepts a base64 data URL string
   * - Converts to HTMLImageElement and runs analysis
   */
  const analyzeFromImage = useCallback(async (imageDataUrl: string): Promise<AnalysisResult | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const result = await analyzeImage(img);
        resolve(result);
      };
      img.onerror = () => {
        setError('Failed to load image');
        resolve(null);
      };
      img.src = imageDataUrl;
    });
  }, [analyzeImage]);

  /**
   * analyzeFromVideo
   * - Accepts an HTMLVideoElement
   * - Runs analysis directly
   */
  const analyzeFromVideo = useCallback(async (video: HTMLVideoElement): Promise<AnalysisResult | null> => {
    return analyzeImage(video);
  }, [analyzeImage]);

  return {
    loadingModels,
    modelsLoaded,
    error,
    analyzeImage,
    analyzeFromImage,
    analyzeFromVideo,
    loadModels,
  };
}
