"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, ImageIcon, Mic, FileAudio, Brain, Eye, Hand, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function Screening() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("facial")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  // File upload refs
  const audioFileRef = useRef<HTMLInputElement>(null)
  const imageFileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  // File states
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "audio/wav") {
      setSelectedAudioFile(file)
      console.log("Audio file selected:", file.name)
    } else {
      alert("Please select a valid .wav audio file")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      console.log("Image file selected:", file.name)
    } else {
      alert("Please select a valid image file")
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      console.log("Camera image captured:", file.name)
    }
  }

  const handleAnalysis = async (analysisType: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      let endpoint = ""

      switch (analysisType) {
        case "facial":
          if (!selectedImageFile) {
            alert("Please upload an image for facial analysis")
            return
          }
          formData.append("image", selectedImageFile)
          endpoint = "/api/facial-analysis"
          break
        case "voice":
          if (!selectedAudioFile) {
            alert("Please upload an audio file for voice analysis")
            return
          }
          formData.append("audio", selectedAudioFile)
          endpoint = "/api/voice-analysis"
          break
        case "handwritten":
          if (!selectedImageFile) {
            alert("Please upload an image for handwritten analysis")
            return
          }
          formData.append("image", selectedImageFile)
          endpoint = "/api/handwritten-analysis"
          break
      }

      // This would be your actual API call to Flask backend
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result)
      } else {
        throw new Error("Analysis failed")
      }
    } catch (error) {
      console.error("Analysis error:", error)
      // Mock result for demonstration
      setAnalysisResult({
        analysisType,
        confidence: Math.random() * 100,
        severity: ["low", "moderate", "high", "severe"][Math.floor(Math.random() * 4)],
        details: `Mock ${analysisType} analysis result`,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetFiles = () => {
    setSelectedAudioFile(null)
    setSelectedImageFile(null)
    setPreviewUrl(null)
    setAnalysisResult(null)
    if (audioFileRef.current) audioFileRef.current.value = ""
    if (imageFileRef.current) imageFileRef.current.value = ""
    if (cameraRef.current) cameraRef.current.value = ""
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100 border-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "severe":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const tabConfigs = [
    {
      value: "facial",
      label: "Facial Analysis",
      icon: Eye,
      color: "#1E90FF",
      bgColor: "bg-blue-50",
    },
    {
      value: "voice",
      label: "Voice Analysis",
      icon: Mic,
      color: "#10B981",
      bgColor: "bg-green-50",
    },
    {
      value: "handwritten",
      label: "Handwritten Analysis",
      icon: Hand,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="mr-4 p-2 text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Screening Analysis</h1>
                  <p className="text-green-100">Analyze patient data using machine learning models</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={resetFiles}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-colors"
            >
              Reset All
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Analysis Tabs */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                  <Brain className="w-6 h-6 mr-3 text-green-600" />
                  Select Analysis Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                    {tabConfigs.map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md"
                          style={{
                            color: activeTab === tab.value ? tab.color : "#6B7280",
                          }}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          <span className="font-medium">{tab.label}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  {/* Facial Analysis Tab */}
                  <TabsContent value="facial" className="space-y-6 mt-8">
                    <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 transition-colors group">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Eye className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Facial Expression Analysis</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upload an image to analyze facial expressions and emotional states using advanced AI
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => imageFileRef.current?.click()}
                          className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-12 px-6"
                        >
                          <ImageIcon className="w-5 h-5 mr-2" />
                          Upload from Gallery
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => cameraRef.current?.click()}
                          className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 h-12 px-6"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Take Photo
                        </Button>
                      </div>

                      <input
                        ref={imageFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <input
                        ref={cameraRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                      />
                    </div>

                    {previewUrl && (
                      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-lg"
                        />
                        <Button
                          onClick={() => handleAnalysis("facial")}
                          disabled={isAnalyzing}
                          className="mt-6 h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Analyzing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Eye className="w-5 h-5 mr-2" />
                              Start Facial Analysis
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Voice Analysis Tab */}
                  <TabsContent value="voice" className="space-y-6 mt-8">
                    <div className="text-center p-8 border-2 border-dashed border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-300 transition-colors group">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Mic className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Voice Pattern Analysis</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upload a .wav audio file to analyze speech patterns and vocal biomarkers
                      </p>

                      <Button
                        variant="outline"
                        onClick={() => audioFileRef.current?.click()}
                        className="bg-white/80 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 h-12 px-6"
                      >
                        <FileAudio className="w-5 h-5 mr-2" />
                        Upload Audio File (.wav)
                      </Button>

                      <input
                        ref={audioFileRef}
                        type="file"
                        accept=".wav,audio/wav"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </div>

                    {selectedAudioFile && (
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileAudio className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">{selectedAudioFile.name}</p>
                        <p className="text-sm text-gray-600 mb-6">
                          Size: {(selectedAudioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          onClick={() => handleAnalysis("voice")}
                          disabled={isAnalyzing}
                          className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Analyzing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Mic className="w-5 h-5 mr-2" />
                              Start Voice Analysis
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Handwritten Analysis Tab */}
                  <TabsContent value="handwritten" className="space-y-6 mt-8">
                    <div className="text-center p-8 border-2 border-dashed border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:border-purple-300 transition-colors group">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Hand className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Handwriting Analysis</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upload an image of handwritten text to analyze writing patterns and psychological indicators
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => imageFileRef.current?.click()}
                          className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 h-12 px-6"
                        >
                          <ImageIcon className="w-5 h-5 mr-2" />
                          Upload from Gallery
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => cameraRef.current?.click()}
                          className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 h-12 px-6"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>

                    {previewUrl && (
                      <div className="text-center bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-lg"
                        />
                        <Button
                          onClick={() => handleAnalysis("handwritten")}
                          disabled={isAnalyzing}
                          className="mt-6 h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Analyzing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Hand className="w-5 h-5 mr-2" />
                              Start Handwriting Analysis
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Results Sidebar */}
          <div className="space-y-6">
            {/* Analysis Results */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <CardTitle className="text-lg font-bold flex items-center text-gray-900">
                  <Brain className="w-5 h-5 mr-2 text-gray-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Analyzing data...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold mb-2 text-gray-900">Analysis Type</h4>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize">
                        {analysisResult.analysisType}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <h4 className="font-semibold mb-2 text-gray-900">Confidence Score</h4>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analysisResult.confidence?.toFixed(1)}%
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                      <h4 className="font-semibold mb-2 text-gray-900">Severity Level</h4>
                      <Badge className={`${getSeverityColor(analysisResult.severity)} border font-medium`}>
                        {analysisResult.severity?.charAt(0).toUpperCase() + analysisResult.severity?.slice(1)}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100">
                      <h4 className="font-semibold mb-2 text-gray-900">Details</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{analysisResult.details}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">No analysis results yet</p>
                    <p className="text-sm mt-1">Upload data and run analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Quick Info */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900">Analysis Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "Facial Analysis", icon: Eye, color: "#1E90FF" },
                    { name: "Voice Analysis", icon: Mic, color: "#10B981" },
                    { name: "Handwriting Analysis", icon: Hand, color: "#8B5CF6" },
                  ].map((item) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
