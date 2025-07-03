"use client"
import { useState } from "react"
import { Users, CalendarDays, BarChart3, TrendingUp, Clock, AlertTriangle, Bell, Brain, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
  type: "info" | "warning" | "success" | "error"
}

export default function Dashboard() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Patient Registration",
      message: "Sarah Johnson has completed her registration",
      time: "2 minutes ago",
      isRead: false,
      type: "success",
    },
    {
      id: "2",
      title: "Appointment Reminder",
      message: "You have an appointment with John Smith in 30 minutes",
      time: "28 minutes ago",
      isRead: false,
      type: "info",
    },
    {
      id: "3",
      title: "Report Generated",
      message: "Analysis report for Michael Brown is ready",
      time: "1 hour ago",
      isRead: true,
      type: "success",
    },
    {
      id: "4",
      title: "System Update",
      message: "New AI model version deployed successfully",
      time: "3 hours ago",
      isRead: true,
      type: "info",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  // Mock stats data
  const stats = {
    totalPatients: 156,
    todayAppointments: 8,
    completedSessions: 1240,
    pendingReports: 12,
  }

  const statsCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "#1E90FF",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase",
      route: "/patients",
    },
    {
      title: "Today's Sessions",
      value: stats.todayAppointments,
      icon: Clock,
      color: "#10B981",
      bgColor: "bg-green-50",
      change: "3 completed",
      changeType: "neutral",
      route: "/appointments",
    },
    {
      title: "Completed Sessions",
      value: stats.completedSessions,
      icon: BarChart3,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
      change: "89 this month",
      changeType: "neutral",
      route: "/appointments",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: AlertTriangle,
      color: "#F59E0B",
      bgColor: "bg-yellow-50",
      change: "Needs attention",
      changeType: "warning",
      route: "#",
    },
  ]

  const navigationCards = [
    {
      title: "Start Screening",
      description: "Run AI analysis on patient data",
      icon: BarChart3,
      route: "/screening",
      color: "#10B981",
      count: null,
    },
    {
      title: "Patients",
      description: "Manage patient records and reports",
      icon: Users,
      route: "/patients",
      color: "#1E90FF",
      count: stats.totalPatients,
    },
    {
      title: "Today's Appointments",
      description: "View today's scheduled sessions",
      icon: Clock,
      route: "/appointments",
      color: "#8B5CF6",
      count: stats.todayAppointments,
    },
    {
      title: "Reports",
      description: "Generate and view analysis reports",
      icon: TrendingUp,
      route: "#",
      color: "#F59E0B",
      count: null,
    },
    {
      title: "Schedule Calendar",
      description: "Schedule new sessions and send invites",
      icon: CalendarDays,
      route: "/schedulecalendar",
      color: "#EF4444",
      count: null,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢"
      case "warning":
        return "🟡"
      case "error":
        return "🔴"
      default:
        return "🔵"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left - Logo */}
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: "#1E90FF" }}
              >
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Psychological Portal</h1>
                <p className="text-sm text-gray-500">AI-Powered Mental Health Analysis</p>
              </div>
            </div>

            {/* Center - Dashboard Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              {/* <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p> */}
            </div>

            {/* Right - Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="w-6 h-6 text-gray-600" />
                    {unreadCount > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        style={{ backgroundColor: "#EF4444" }}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>Notifications</DialogTitle>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                          Mark all as read
                        </Button>
                      )}
                    </div>
                  </DialogHeader>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            notification.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dr. Smith</p>
                  <p className="text-xs text-gray-500">Psychologist</p>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={stat.title}
                className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105`}
                onClick={() => {
                  if (stat.route !== "#") {
                    router.push(stat.route)
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                      <p
                        className={`text-xs mt-2 flex items-center ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : stat.changeType === "warning"
                              ? "text-orange-600"
                              : "text-gray-500"
                        }`}
                      >
                        {stat.changeType === "increase" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
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

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {navigationCards.map((card) => {
            const IconComponent = card.icon
            return (
              <Card
                key={card.title}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
                onClick={() => {
                  if (card.route === "#") {
                    alert("Reports feature coming soon!")
                  } else {
                    router.push(card.route)
                  }
                }}
              >
                {/* Background Pattern */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-8 -translate-y-8"
                  style={{ backgroundColor: card.color }}
                />

                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                      style={{
                        backgroundColor: card.color,
                        boxShadow: `0 8px 25px -8px ${card.color}40`,
                      }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    {card.count && (
                      <div className="text-right">
                        <div
                          className="text-3xl font-bold group-hover:scale-105 transition-transform duration-300"
                          style={{ color: card.color }}
                        >
                          {card.count}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Total</div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {card.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col flex-grow">
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6">{card.description}</p>

                  <div className="relative mt-auto">
                    <Button
                      className="w-full h-12 font-semibold text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden"
                      style={{ backgroundColor: card.color }}
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />

                      <span className="relative z-10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 mr-2" />
                        Open {card.title.split(" ")[0]}
                      </span>
                    </Button>
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${card.color}08 0%, transparent 70%)`,
                  }}
                />
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
