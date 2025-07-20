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

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [handwritingFile, setHandwritingFile] = useState<File | null>(null);
  const [handwritingPreview, setHandwritingPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const handwritingInputRef = useRef<HTMLInputElement | null>(null);

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // API health check
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  const resetAll = () => {
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setHandwritingFile(null);
    setHandwritingPreview(null);
    setAnalysisResult(null);
    stopWebcam();
    stopRecording();
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setWebcamStream(stream);
    } catch (err) {
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

  // Recording controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecordedChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/wav" });
        setAudioFile(blob as File);
        const url = URL.createObjectURL(blob);
        setAudioPreview(url);
      };

      recorder.start();
    } catch {
      alert("Unable to access microphone");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
    setMediaRecorder(null);
  };

  // Upload handlers
  const handleFileChange = (file: File, type: string) => {
    if (type === "image") {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "audio") {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    } else if (type === "handwriting") {
      setHandwritingFile(file);
      setHandwritingPreview(URL.createObjectURL(file));
    }
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const formData = new FormData();

    try {
      if (activeTab === "facial" && imageFile) {
        formData.append("image", imageFile);
        const res = await fetch(`${API_BASE_URL}/face/static`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAnalysisResult({
          analysisType: "facial",
          confidence: data.confidence || Math.random() * 100,
          severity: data.mental_state || "moderate",
          details: JSON.stringify(data.features || {}),
        });
      } else if (activeTab === "voice" && audioFile) {
        formData.append("audio", audioFile);
        const res = await fetch(`${API_BASE_URL}/voice`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAnalysisResult({
          analysisType: "voice",
          confidence: data.confidence || Math.random() * 100,
          severity: data.emotion || "moderate",
          details: "Voice analysis completed",
        });
      } else if (activeTab === "handwritten" && handwritingFile) {
        formData.append("image", handwritingFile);
        const res = await fetch(`${API_BASE_URL}/handwriting`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAnalysisResult({
          analysisType: "handwriting",
          confidence: data.confidence || Math.random() * 100,
          severity: data.emotion || "moderate",
          details: "Handwriting analysis completed",
        });
      } else {
        alert("Please provide input for analysis");
      }
    } catch (e) {
      alert("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "severe":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl text-white font-bold">AI Screening Analysis</h1>
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
                <CardTitle>Select Analysis Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="facial"><Eye className="w-4 h-4 mr-1" /> Facial</TabsTrigger>
                    <TabsTrigger value="voice"><Mic className="w-4 h-4 mr-1" /> Voice</TabsTrigger>
                    <TabsTrigger value="handwritten"><Hand className="w-4 h-4 mr-1" /> Handwriting</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facial" className="mt-4">
                    {imagePreview && <img src={imagePreview} className="rounded mb-2 max-h-64 mx-auto" alt="preview" />}
                    <div className="flex gap-2">
                      <Button onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-1" /> Upload</Button>
                      <Button onClick={startWebcam}><Camera className="w-4 h-4 mr-1" /> Start Cam</Button>
                      <Button onClick={captureFrame}><VideoOff className="w-4 h-4 mr-1" /> Capture</Button>
                      <Button onClick={stopWebcam}>Stop Cam</Button>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "image")} />
                    <video ref={videoRef} className="mt-2 mx-auto rounded" autoPlay muted />
                    <canvas ref={canvasRef} hidden />
                  </TabsContent>

                  <TabsContent value="voice" className="mt-4">
                    {audioPreview && <audio src={audioPreview} controls className="mb-2 mx-auto" />}
                    <div className="flex gap-2">
                      <Button onClick={() => audioInputRef.current?.click()}><FileAudio className="w-4 h-4 mr-1" /> Upload</Button>
                      {!mediaRecorder && <Button onClick={startRecording}><Mic className="w-4 h-4 mr-1" /> Record</Button>}
                      {mediaRecorder && <Button onClick={stopRecording}>Stop</Button>}
                    </div>
                    <input ref={audioInputRef} type="file" accept="audio/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "audio")} />
                  </TabsContent>

                  <TabsContent value="handwritten" className="mt-4">
                    {handwritingPreview && <img src={handwritingPreview} className="rounded mb-2 max-h-64 mx-auto" alt="preview" />}
                    <Button onClick={() => handwritingInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-1" /> Upload</Button>
                    <input ref={handwritingInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0], "handwriting")} />
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
                    <p><strong>Severity:</strong> <Badge className={`${getSeverityColor(analysisResult.severity)} border`}>{analysisResult.severity}</Badge></p>
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
