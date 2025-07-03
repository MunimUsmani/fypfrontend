"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, Mail, Plus, Send, CalendarDays, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function ScheduleCalendar() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [sessionType, setSessionType] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Generate time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ]

  const sessionTypes = [
    "Initial Consultation",
    "Anxiety Therapy",
    "Depression Counseling",
    "PTSD Treatment",
    "Stress Management",
    "Bipolar Support",
    "Family Therapy",
    "Group Session",
    "Follow-up Session",
  ]

  // Mock existing patients for quick selection
  const existingPatients = [
    { name: "John Smith", email: "john.smith@email.com" },
    { name: "Sarah Johnson", email: "sarah.j@email.com" },
    { name: "Michael Brown", email: "m.brown@email.com" },
    { name: "Emily Davis", email: "emily.davis@email.com" },
    { name: "David Wilson", email: "d.wilson@email.com" },
  ]

  const todaySchedule = [
    { name: "John Smith", type: "Anxiety Therapy", time: "10:00 AM", status: "completed" },
    { name: "Sarah Johnson", type: "Depression Counseling", time: "2:30 PM", status: "in-progress" },
    { name: "Michael Brown", type: "PTSD Treatment", time: "4:00 PM", status: "scheduled" },
  ]

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would be your API call to send email invite
      const inviteData = {
        patientEmail,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        notes,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Sending invite:", inviteData)
      alert(`Session invite sent successfully to ${patientEmail}!`)

      // Reset form
      setSelectedDate("")
      setSelectedTime("")
      setPatientEmail("")
      setSessionType("")
      setNotes("")
    } catch (error) {
      console.error("Error sending invite:", error)
      alert("Failed to send invite. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSelect = (email: string) => {
    setPatientEmail(email)
  }

  // Get today's date for min date input
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
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
                  <CalendarDays className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Schedule Calendar</h1>
                  <p className="text-red-100">Schedule sessions and send email invites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Schedule Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                  <Calendar className="w-6 h-6 mr-3 text-red-600" />
                  Schedule New Session
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSendInvite} className="space-y-6">
                  {/* Patient Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail" className="text-sm font-semibold text-gray-700">
                      Patient Email
                    </Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="Enter patient's email address"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-red-500 bg-white shadow-sm transition-all duration-300"
                    />
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                      Session Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={today}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-red-500 bg-white shadow-sm transition-all duration-300"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-semibold text-gray-700">
                      Session Time
                    </Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime} required>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-red-500 bg-white shadow-sm transition-all duration-300">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Session Type */}
                  <div className="space-y-2">
                    <Label htmlFor="sessionType" className="text-sm font-semibold text-gray-700">
                      Session Type
                    </Label>
                    <Select value={sessionType} onValueChange={setSessionType} required>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-red-500 bg-white shadow-sm transition-all duration-300">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special instructions or notes for the session..."
                      rows={4}
                      className="border-2 border-gray-200 focus:border-red-500 bg-white shadow-sm transition-all duration-300"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !patientEmail || !selectedDate || !selectedTime || !sessionType}
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Invite...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send Session Invite
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Patient Selection */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="text-lg font-bold text-gray-900">Quick Select Patient</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {existingPatients.map((patient) => (
                    <Button
                      key={patient.email}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 group"
                      onClick={() => handleQuickSelect(patient.email)}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule Preview */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="text-lg font-bold text-gray-900">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {todaySchedule.map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{appointment.name}</div>
                          <div className="text-sm text-gray-500">{appointment.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-600">{appointment.time}</div>
                        <Badge
                          className={`text-xs mt-1 ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : appointment.status === "in-progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {appointment.status === "in-progress"
                            ? "In Progress"
                            : appointment.status === "completed"
                              ? "Completed"
                              : "Scheduled"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                    onClick={() => router.push("/patients")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                    onClick={() => router.push("/appointments")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Appointments
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 bg-white border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
