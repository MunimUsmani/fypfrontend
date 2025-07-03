"use client"

import { useState } from "react"
import { Search, Download, ArrowLeft, Filter, MoreHorizontal, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Patient {
  id: string
  name: string
  email: string
  category: string
  visitDate: string
  visitTime: string
  severity: "low" | "moderate" | "high" | "severe"
}

export default function Patients() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  // Mock patient data
  const patients: Patient[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      category: "Anxiety Disorder",
      visitDate: "2024-01-15",
      visitTime: "10:00 AM",
      severity: "moderate",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      category: "Depression",
      visitDate: "2024-01-14",
      visitTime: "2:30 PM",
      severity: "high",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "m.brown@email.com",
      category: "PTSD",
      visitDate: "2024-01-13",
      visitTime: "11:15 AM",
      severity: "severe",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      category: "Stress Management",
      visitDate: "2024-01-12",
      visitTime: "9:00 AM",
      severity: "low",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "d.wilson@email.com",
      category: "Bipolar Disorder",
      visitDate: "2024-01-11",
      visitTime: "3:45 PM",
      severity: "high",
    },
  ]

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadReport = async (patientId: string, patientName: string) => {
    try {
      // This would be your API call to generate and download the PDF report
      const response = await fetch(`/api/reports/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${patientName}_report.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading report:", error)
      // For demo purposes, show alert
      alert(`Downloading report for ${patientName}...`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
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
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Patients</h1>
                  <p className="text-blue-100">Manage patient records and reports</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors h-10 px-6">
                <Users className="w-4 h-4 mr-2" />
                Add New Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filters */}
        <Card className="mb-8 bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search patients by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 bg-white shadow-sm transition-all duration-300"
                />
              </div>
              <Button
                variant="outline"
                className="h-12 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Patients Table */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="text-xl font-bold flex items-center text-gray-900">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Patient Records ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Patient Name</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Category</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Visit Date</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Visit Time</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Severity</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="font-semibold text-gray-900">{patient.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{patient.email}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                          {patient.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        {new Date(patient.visitDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">{patient.visitTime}</td>
                      <td className="py-4 px-6">
                        <Badge className={`${getSeverityColor(patient.severity)} border font-medium`}>
                          {patient.severity.charAt(0).toUpperCase() + patient.severity.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownloadReport(patient.id, patient.name)}
                            className="h-9 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Report
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 bg-transparent"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
