"use client"
import { ArrowLeft, Clock, User, Calendar, Filter, CheckCircle, PlayCircle, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  patientName: string
  appointmentTime: string
  sessions: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  severity: "low" | "moderate" | "high" | "severe"
  type: string
}

export default function Appointments() {
  const router = useRouter()

  // Mock appointment data for today
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      appointmentTime: "09:00 AM",
      sessions: 3,
      status: "completed",
      severity: "moderate",
      type: "Anxiety Therapy",
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      appointmentTime: "10:30 AM",
      status: "completed",
      sessions: 7,
      severity: "high",
      type: "Depression Counseling",
    },
    {
      id: "3",
      patientName: "Michael Brown",
      appointmentTime: "11:45 AM",
      status: "in-progress",
      sessions: 12,
      severity: "severe",
      type: "PTSD Treatment",
    },
    {
      id: "4",
      patientName: "Emily Davis",
      appointmentTime: "02:00 PM",
      status: "scheduled",
      sessions: 1,
      severity: "low",
      type: "Stress Management",
    },
    {
      id: "5",
      patientName: "David Wilson",
      appointmentTime: "03:30 PM",
      status: "scheduled",
      sessions: 5,
      severity: "high",
      type: "Bipolar Support",
    },
    {
      id: "6",
      patientName: "Lisa Anderson",
      appointmentTime: "04:45 PM",
      status: "scheduled",
      sessions: 2,
      severity: "moderate",
      type: "Anxiety Therapy",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "severe":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "scheduled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "scheduled":
        return "Scheduled"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statsData = [
    {
      title: "Total Today",
      value: appointments.length,
      icon: Clock,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
    },
    {
      title: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: appointments.filter((a) => a.status === "in-progress").length,
      icon: PlayCircle,
      color: "#1E90FF",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upcoming",
      value: appointments.filter((a) => a.status === "scheduled").length,
      icon: Calendar,
      color: "#F59E0B",
      bgColor: "bg-yellow-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
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
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Today's Appointments</h1>
                  <p className="text-purple-100">{todayDate}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/schedulecalendar")}
                className="bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors h-10 px-6"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={stat.title}
                className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: stat.color }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enhanced Appointments List */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                <Clock className="w-6 h-6 mr-3 text-purple-600" />
                Appointment Schedule
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Patient Name</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Appointment Time</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Session Type</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">No. of Sessions</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Severity</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr
                      key={appointment.id}
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 transition-all duration-300 group ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="font-semibold text-gray-900">{appointment.patientName}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600 font-medium">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {appointment.appointmentTime}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
                          {appointment.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">Session {appointment.sessions}</td>
                      <td className="py-4 px-6">
                        <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${getSeverityColor(appointment.severity)} shadow-sm`}
                          ></div>
                          <span className="text-sm text-gray-600 capitalize font-medium">{appointment.severity}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {appointment.status === "scheduled" && (
                            <Button
                              size="sm"
                              className="h-9 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Start Session
                            </Button>
                          )}
                          {appointment.status === "in-progress" && (
                            <Button
                              size="sm"
                              className="h-9 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {appointment.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 px-4 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 bg-transparent"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Notes
                            </Button>
                          )}
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
