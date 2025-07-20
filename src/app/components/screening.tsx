"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, ImageIcon, Mic, Hand, Eye, Camera, VideoOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

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
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    facial: false,
    handwriting: false,
    voice: false,
  });

  const [results, setResults] = useState<{ [key: string]: AnalysisResult | null }>({
    facial: null,
    handwriting: null,
    voice: null,
  });

  const [summary, setSummary] = useState<{ avgConfidence: number; overallInference: string } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const handwritingInputRef = useRef<HTMLInputElement | null>(null);

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  // Audio Recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasAudioRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  const resetAll = () => {
    setImageFile(null);
    setAudioFile(null);
    setAudioURL(null);
    setImagePreview(null);
    stopWebcam();
    stopRecording();
    clearCanvas();
    setResults({ facial: null, handwriting: null, voice: null });
    setCompletedSteps({ facial: false, handwriting: false, voice: false });
    setSummary(null);
    setActiveTab("facial");
  };

  /** Webcam **/
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

  /** Audio Recording **/
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      setAudioURL(null);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      startWaveform(analyser);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([audioBlob], "recorded.wav", { type: "audio/wav" });
        setAudioFile(file);
        setCompletedSteps(prev => ({ ...prev, voice: true }));

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        cancelAnimationFrame(animationRef.current!);
        clearCanvas();
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const startWaveform = (analyser: AnalyserNode) => {
    const canvas = canvasAudioRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const WIDTH = canvas.offsetWidth;
    const HEIGHT = 120;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#16a34a";
      ctx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();
    };

    draw();
  };

  const clearCanvas = () => {
    const canvas = canvasAudioRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /** Analyze **/
  const analyze = async () => {
    setIsAnalyzing(true);
    const formData = new FormData();
    let url = "";
    let currentTab = activeTab;

    try {
      if (currentTab === "facial") {
        if (!imageFile) return alert("Upload or capture a facial image.");
        formData.append("image", imageFile);
        url = `${API_BASE_URL}/face/static`;
      } else if (currentTab === "handwriting") {
        if (!imageFile) return alert("Upload a handwriting image.");
        formData.append("image", imageFile);
        url = `${API_BASE_URL}/handwriting`;
      } else if (currentTab === "voice") {
        if (!audioFile) return alert("Record or upload audio.");
        formData.append("audio", audioFile);
        url = `${API_BASE_URL}/voice`;
      }

      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      const fallbackEmotion = data.emotion || data.details?.emotion || "Unknown";
      const fallbackConfidence = data.confidence || data.details?.confidence || 0.0;

      const result: AnalysisResult = {
        analysisType: currentTab,
        confidence: parseFloat(fallbackConfidence),
        severity:
          data.psychological_inference && data.psychological_inference !== "Unknown"
            ? data.psychological_inference
            : fallbackEmotion !== "Unknown"
            ? `Possible ${fallbackEmotion}`
            : "Unknown",
        details: "" // Removed JSON details
      };

      setResults(prev => ({ ...prev, [currentTab]: result }));
      setCompletedSteps(prev => ({ ...prev, [currentTab]: true }));

      if (currentTab === "facial") setActiveTab("handwriting");
      else if (currentTab === "handwriting") setActiveTab("voice");
      else if (currentTab === "voice") {
        const allResults = Object.values(results).filter(r => r !== null) as AnalysisResult[];
        const newResults = [...allResults, result];

        if (newResults.length === 3) {
          const avgConfidence = newResults.reduce((acc, r) => acc + r.confidence, 0) / 3;

          // ✅ SINGLE DECISION LOGIC
          const allSeverities = newResults.map(r => r.severity.toLowerCase());
          let finalInference = "No Distress Detected";
          if (allSeverities.some(s => s.includes("stress"))) {
            finalInference = "Stress";
          } else if (allSeverities.some(s => s.includes("anxiety"))) {
            finalInference = "Anxiety";
          } else if (allSeverities.some(s => s.includes("depression"))) {
            finalInference = "Depression";
          }

          setSummary({ avgConfidence, overallInference: finalInference });
          setActiveTab("summary");
        }
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
    if (s.includes("no distress") || s.includes("normal") || s.includes("low"))
      return "text-green-600 bg-green-100 border-green-200";
    if (s.includes("depression")) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (s.includes("anxiety")) return "text-orange-600 bg-orange-100 border-orange-200";
    if (s.includes("stress") || s.includes("distress"))
      return "text-red-600 bg-red-100 border-red-200";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  /** ✅ Professional PDF Export **/
  const generatePDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // HEADER
    doc.setFontSize(18);
    doc.setTextColor(22, 160, 133);
    doc.text("AI Psychological Screening Report", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // SUMMARY
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Summary", 14, 45);
    doc.setFontSize(12);
    doc.text(`Average Confidence: ${summary.avgConfidence.toFixed(2)}%`, 14, 55);
    doc.text(`Overall Inference: ${summary.overallInference}`, 14, 65);

    // TABLE HEADER
    doc.setFontSize(14);
    doc.text("Detailed Analysis", 14, 80);

    const startY = 90;
    doc.setFillColor(230, 230, 230);
    doc.rect(14, startY, pageWidth - 28, 10, "F");
    doc.setTextColor(0);
    doc.text("Type", 16, startY + 7);
    doc.text("Confidence", 70, startY + 7);
    doc.text("Inference", 120, startY + 7);

    let currentY = startY + 15;
    ["facial", "handwriting", "voice"].forEach((type) => {
      const result = results[type];
      if (result) {
        let color = [0, 0, 0];
        if (result.severity.toLowerCase().includes("normal")) color = [34, 139, 34];
        else if (result.severity.toLowerCase().includes("depression")) color = [255, 165, 0];
        else if (result.severity.toLowerCase().includes("anxiety")) color = [255, 140, 0];
        else if (result.severity.toLowerCase().includes("stress")) color = [220, 20, 60];

        doc.setTextColor(0);
        doc.text(type.toUpperCase(), 16, currentY);
        doc.text(`${result.confidence.toFixed(2)}%`, 70, currentY);
        doc.setTextColor(...color);
        doc.text(result.severity, 120, currentY);

        currentY += 10;
      }
    });

    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text("Generated by AI Psychological Screening System", pageWidth / 2, 280, { align: "center" });

    doc.save("Psychological_Screening_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 shadow-lg">
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
            API is not reachable. Please start your backend server.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Screening Input</CardTitle></CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="facial"><Eye className="w-4 h-4 mr-1" /> Facial</TabsTrigger>
                    <TabsTrigger value="handwriting" disabled={!completedSteps.facial}><Hand className="w-4 h-4 mr-1" /> Handwriting</TabsTrigger>
                    <TabsTrigger value="voice" disabled={!completedSteps.handwriting}><Mic className="w-4 h-4 mr-1" /> Voice</TabsTrigger>
                    <TabsTrigger value="summary" disabled={!completedSteps.voice}>Summary</TabsTrigger>
                  </TabsList>

                  {/* Facial */}
                  <TabsContent value="facial" className="mt-4">
                    {imagePreview && <img src={imagePreview} className="rounded mb-2 max-h-64 mx-auto" alt="preview" />}
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={() => imageInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-1" /> Upload</Button>
                      <Button onClick={startWebcam}><Camera className="w-4 h-4 mr-1" /> Start Cam</Button>
                      <Button onClick={captureFrame}><VideoOff className="w-4 h-4 mr-1" /> Capture</Button>
                      <Button onClick={stopWebcam}>Stop Cam</Button>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                    <video ref={videoRef} className="mt-2 mx-auto rounded" autoPlay muted />
                    <canvas ref={canvasRef} hidden />
                  </TabsContent>

                  {/* Handwriting */}
                  <TabsContent value="handwriting" className="mt-4">
                    <Button onClick={() => handwritingInputRef.current?.click()}><Hand className="w-4 h-4 mr-1" /> Upload Handwriting</Button>
                    <input ref={handwritingInputRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                    {imagePreview && <img src={imagePreview} className="rounded mt-4 mx-auto max-h-64" />}
                  </TabsContent>

                  {/* Voice */}
                  <TabsContent value="voice" className="mt-4">
                    <div className="flex gap-3 mb-3">
                      {!isRecording ? (
                        <Button onClick={startRecording}><Mic className="w-4 h-4 mr-1" /> Start Recording</Button>
                      ) : (
                        <Button onClick={stopRecording} variant="destructive">Stop & Save</Button>
                      )}
                    </div>
                    {isRecording && (
                      <canvas
                        ref={canvasAudioRef}
                        style={{
                          width: "100%",
                          height: "120px",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    {audioURL && !isRecording && (
                      <div className="mt-4">
                        <audio controls src={audioURL} className="w-full" />
                      </div>
                    )}
                  </TabsContent>

                  {/* Summary */}
                  <TabsContent value="summary" className="mt-4">
                    {summary ? (
                      <div className="p-4 border rounded bg-white">
                        <h3 className="text-lg font-bold mb-2">Overall Screening Result</h3>
                        <p><strong>Average Confidence:</strong> {summary.avgConfidence.toFixed(2)}%</p>
                        <p><strong>Overall Inference:</strong> {summary.overallInference}</p>

                        <hr className="my-4" />
                        <h4 className="font-semibold">Detailed Results:</h4>
                        {["facial", "handwriting", "voice"].map((type) => {
                          const result = results[type];
                          return (
                            <div key={type} className="mt-2">
                              <p><strong>{type.toUpperCase()}:</strong> {result?.severity} ({result?.confidence.toFixed(2)}%)</p>
                            </div>
                          );
                        })}

                        <Button className="mt-4 bg-blue-600 text-white" onClick={generatePDF}>
                          Download PDF Report
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500">Complete all steps to see summary.</p>
                    )}
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
              <CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader>
              <CardContent>
                {["facial", "handwriting", "voice"].map((type) => {
                  const result = results[type];
                  return (
                    <div key={type} className="mb-4">
                      <h3 className="font-semibold capitalize">{type} Result</h3>
                      {result ? (
                        <div className="pl-2 border-l-4 border-emerald-400 mt-1">
                          <p><strong>Confidence:</strong> {result.confidence.toFixed(1)}%</p>
                          <p><strong>Inference:</strong>
                            <Badge className={`${getSeverityColor(result.severity)} border`}>
                              {result.severity}
                            </Badge>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Not analyzed yet.</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
