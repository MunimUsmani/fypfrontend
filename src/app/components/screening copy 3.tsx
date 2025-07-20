"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, ImageIcon, Mic, Hand, Eye, Camera, VideoOff, FileAudio, Brain,
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
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const handwritingInputRef = useRef<HTMLInputElement | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  const resetAll = () => {
    setImageFile(null);
    setAudioFile(null);
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

  const handleFileChange = (file: File, type: "image" | "audio") => {
    if (type === "image") {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setAudioFile(file);
    }
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();

    try {
      let url = "";
      if (activeTab === "facial") {
        if (!imageFile) return alert("Upload or capture a facial image.");
        formData.append("image", imageFile);
        url = `${API_BASE_URL}/face/static`;
      } else if (activeTab === "handwriting") {
        if (!imageFile) return alert("Upload a handwriting image.");
        formData.append("image", imageFile);
        url = `${API_BASE_URL}/handwriting`;
      } else if (activeTab === "voice") {
        if (!audioFile) return alert("Upload an audio file.");
        formData.append("audio", audioFile);
        url = `${API_BASE_URL}/voice`;
      }

      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        const confidence = parseFloat(data.confidence || "0");
        setAnalysisResult({
          analysisType: activeTab,
          confidence: isNaN(confidence) ? 0 : confidence,
          severity: data.psychological_inference || "Unknown",
          details: data.details || JSON.stringify(data, null, 2),
        });
      }
    } catch (e) {
      console.error("Analysis failed:", e);
      alert("Analysis failed. See console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes("no distress") || s.includes("low")) return "text-green-600 bg-green-100 border-green-200";
    if (s.includes("depression")) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (s.includes("anxiety")) return "text-orange-600 bg-orange-100 border-orange-200";
    if (s.includes("stress") || s.includes("distress")) return "text-red-600 bg-red-100 border-red-200";
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
            <h1 className="text-2xl text-white font-bold">AI Psychological Screening</h1>
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
              <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="facial"><Eye className="w-4 h-4 mr-1" /> Facial</TabsTrigger>
                    <TabsTrigger value="handwriting"><Hand className="w-4 h-4 mr-1" /> Handwriting</TabsTrigger>
                    <TabsTrigger value="voice"><Mic className="w-4 h-4 mr-1" /> Voice</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facial" className="mt-4">
                    {imagePreview && <img src={imagePreview} className="rounded mb-2 max-h-64 mx-auto" alt="preview" />}
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-1" /> Upload</Button>
                      <Button onClick={startWebcam}><Camera className="w-4 h-4 mr-1" /> Start Cam</Button>
                      <Button onClick={captureFrame}><VideoOff className="w-4 h-4 mr-1" /> Capture</Button>
                      <Button onClick={stopWebcam}>Stop Cam</Button>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "image")} />
                    <video ref={videoRef} className="mt-2 mx-auto rounded" autoPlay muted />
                    <canvas ref={canvasRef} hidden />
                  </TabsContent>

                  <TabsContent value="handwriting" className="mt-4">
                    <Button onClick={() => handwritingInputRef.current?.click()}><Hand className="w-4 h-4 mr-1" /> Upload Handwriting</Button>
                    <input ref={handwritingInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "image")} />
                    {imagePreview && <img src={imagePreview} className="rounded mt-4 mx-auto max-h-64" />}
                  </TabsContent>

                  <TabsContent value="voice" className="mt-4">
                    <Button onClick={() => audioInputRef.current?.click()}><FileAudio className="w-4 h-4 mr-1" /> Upload Voice</Button>
                    <input ref={audioInputRef} type="file" accept="audio/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "audio")} />
                    {audioFile && <p className="mt-2 text-sm text-gray-700">{audioFile.name}</p>}
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
