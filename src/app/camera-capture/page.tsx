"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CameraCapture() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    setIsCameraLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setStream(mediaStream);
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraLoading(false);
          };
          videoRef.current.onerror = () => {
            console.error("Video error");
            setIsCameraLoading(false);
          };
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraLoading(false);
      alert("Could not access camera. Please check permissions.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setIsCameraLoading(false);
  }, [stream]);

  // Capture frame from camera
  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        return imageData;
      }
    }
    return null;
  }, []);

  // Capture image
  const captureImage = () => {
    const imageData = captureFrame();
    if (imageData) {
      setCapturedImage(imageData);
      stopCamera();
    } else {
      alert("Could not capture image from camera");
    }
  };

  // Send image to parent window
  const sendImageToParent = () => {
    if (capturedImage && window.opener) {
      window.opener.postMessage(
        {
          type: 'CAPTURED_IMAGE',
          imageData: capturedImage
        },
        window.location.origin
      );
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Close popup
  const closePopup = () => {
    stopCamera();
    window.close();
  };

  // Start camera on component mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Camera Capture</h1>
        <Button
          variant="ghost"
          onClick={closePopup}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {!capturedImage ? (
          <div className="text-center">
            {isCameraLoading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white text-lg">Starting camera...</p>
              </div>
            ) : isCameraActive ? (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="rounded-lg shadow-lg max-w-full"
                    style={{ maxHeight: '400px' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-sm">
                    Position your face in the camera view
                  </p>
                  <Button
                    onClick={captureImage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <Camera className="w-6 h-6 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white text-lg">Camera not available</p>
                <Button
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="rounded-lg shadow-lg max-w-full"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-white text-sm">
                Review your captured image
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={sendImageToParent}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  Use This Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-black text-white p-4 text-center">
        <p className="text-sm text-gray-300">
          {!capturedImage 
            ? "Position your face in the camera and click 'Capture Photo'"
            : "Review your photo and click 'Use This Photo' to continue"
          }
        </p>
      </div>
    </div>
  );
} 