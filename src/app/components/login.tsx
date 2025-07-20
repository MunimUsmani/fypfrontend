"use client"

import type React from "react"

import { useState } from "react"
import { Brain, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required"
    }
    return ""
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setPasswordError(validatePassword(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (!emailErr && !passwordErr) {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Login attempt:", { email, password })
        router.push("/dashboard")
      } catch (error) {
        console.error("Login failed:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#1E90FF" }}
            >
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Psychologist Portal</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`pl-10 h-12 border-2 transition-colors ${
                    emailError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#1E90FF]"
                  }`}
                  required
                />
              </div>
              {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 h-12 border-2 transition-colors ${
                    passwordError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#1E90FF]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!emailError || !!passwordError || !email || !password}
              className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1E90FF" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: "#1E90FF" }}
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">Psychological Distress Inference System</p>
          </div>
        </div>
      </div>
    </div>
  )
}