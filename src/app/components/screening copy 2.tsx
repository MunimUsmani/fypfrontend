"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ImageIcon,
  Mic,
  Hand,
  Eye,
  Camera,
  VideoOff,
  FileAudio,
  Brain,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000/api";

interface AnalysisResult {
  analysisType: string;
  confidence: number;
  severity: string;
  details: string;
}

export default function Screening() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("facial");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  const resetAll = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    stopWebcam();
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setWebcamStream(stream);
    } catch {
      alert("Unable to access webcam");
    }
  };

  const stopWebcam = () => {
    webcamStream?.getTracks().forEach((track) => track.stop());
    setWebcamStream(null);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
        setImageFile(file);
        setImagePreview(URL.createObjectURL(blob));
      }
    }, "image/jpeg");
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const analyze = async () => {
    if (!imageFile) {
      alert("Please provide a face image.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch(`${API_BASE_URL}/face/static`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        const maxConfidence = Math.max(
          ...Object.values(data.emotion_scores || {})
        );
        setAnalysisResult({
          analysisType: "facial",
          confidence: maxConfidence,
          severity: data.psychological_inference,
          details: Object.entries(data.emotion_scores || {})
            .map(([emo, val]) => `${emo}: ${val.toFixed(2)}%`)
            .join(", "),
        });
      }
    } catch (e) {
      console.error("Analysis failed:", e);
      alert("Analysis failed. Check console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    if (severity.toLowerCase().includes("low")) return "text-green-600 bg-green-100 border-green-200";
    if (severity.toLowerCase().includes("depression")) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (severity.toLowerCase().includes("anxiety")) return "text-orange-600 bg-orange-100 border-orange-200";
    if (severity.toLowerCase().includes("stress") || severity.toLowerCase().includes("distress"))
      return "text-red-600 bg-red-100 border-red-200";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl text-white font-bold">AI Facial Screening</h1>
          </div>
          <Button variant="outline" onClick={resetAll} className="text-white border-white">
            Reset All
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {apiHealthy === false && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
            Cannot connect to API. Please check your backend server.
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Facial Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-1">
                    <TabsTrigger value="facial"><Eye className="w-4 h-4 mr-1" /> Facial</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facial" className="mt-4">
                    {imagePreview && <img src={imagePreview} className="rounded mb-2 max-h-64 mx-auto" alt="preview" />}
                    <div className="flex gap-2">
                      <Button onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-1" /> Upload</Button>
                      <Button onClick={startWebcam}><Camera className="w-4 h-4 mr-1" /> Start Cam</Button>
                      <Button onClick={captureFrame}><VideoOff className="w-4 h-4 mr-1" /> Capture</Button>
                      <Button onClick={stopWebcam}>Stop Cam</Button>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                    <video ref={videoRef} className="mt-2 mx-auto rounded" autoPlay muted />
                    <canvas ref={canvasRef} hidden />
                  </TabsContent>
                </Tabs>

                <Button className="mt-4 w-full bg-green-600 text-white" onClick={analyze} disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader><CardTitle>Analysis Result</CardTitle></CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div>
                    <p><strong>Type:</strong> <Badge>{analysisResult.analysisType}</Badge></p>
                    <p><strong>Confidence:</strong> {analysisResult.confidence.toFixed(1)}%</p>
                    <p><strong>Inference:</strong> <Badge className={`${getSeverityColor(analysisResult.severity)} border`}>{analysisResult.severity}</Badge></p>
                    <p className="mt-2"><strong>Details:</strong> {analysisResult.details}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No analysis performed yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
