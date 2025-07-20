"use client"

import { useState, useEffect } from "react"
import {
  Brain,
  Users,
  Calendar,
  BarChart3,
  Shield,
  ArrowRight,
  Menu,
  X,
  Eye,
  Heart,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-playfair">PsychPortal</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Services
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Reviews
              </a>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 shadow-lg">
              <div className="flex flex-col space-y-4 px-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Features
                </a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  About
                </a>
                <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Services
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Reviews
                </a>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-full font-medium"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="space-y-8"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-playfair">
                  AI-Powered
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {" "}
                    Mental Health{" "}
                  </span>
                  Analysis
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-inter">
                  Revolutionary psychological distress inference system that combines facial analysis, voice patterns,
                  and handwriting assessment to provide comprehensive mental health insights for healthcare
                  professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-inter"
                >
                  Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 bg-transparent font-inter"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 font-playfair">1000+</div>
                  <div className="text-sm text-gray-600 font-inter">Patients Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 font-playfair">95%</div>
                  <div className="text-sm text-gray-600 font-inter">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 font-playfair">24/7</div>
                  <div className="text-sm text-gray-600 font-inter">Available</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/hero-doctor.avif"
                  alt="Mental Health Professional using AI technology"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              Advanced AI Analysis Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter leading-relaxed">
              Our cutting-edge technology provides comprehensive mental health assessment through multiple analysis
              methods, delivering precise insights for healthcare professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Facial Expression Analysis</h3>
              <p className="text-gray-600 leading-relaxed font-inter">
                Advanced computer vision algorithms analyze facial expressions, micro-expressions, and emotional
                patterns to detect signs of psychological distress with 95% accuracy.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Voice Pattern Recognition</h3>
              <p className="text-gray-600 leading-relaxed font-inter">
                Sophisticated audio processing examines speech patterns, tone variations, and vocal biomarkers to
                identify emotional states and stress levels in real-time.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Handwriting Psychology</h3>
              <p className="text-gray-600 leading-relaxed font-inter">
                Graphology-based AI analyzes handwriting samples to reveal personality traits, emotional states, and
                potential psychological indicators through advanced pattern recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/ai-technology.avif"
                alt="AI Technology and Mental Health Innovation"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-playfair leading-tight">
                Revolutionizing Mental Health Care with AI
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-inter">
                Our platform combines decades of psychological research with cutting-edge artificial intelligence to
                provide accurate, non-invasive mental health assessments. We're bridging the gap between traditional
                psychology and modern technology to create better outcomes for patients worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-inter">HIPAA compliant and enterprise-grade security</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-inter">
                    Real-time analysis with instant comprehensive results
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-inter">Continuous machine learning and accuracy improvement</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-inter">
                    Seamless integration with existing healthcare systems
                  </span>
                </div>
              </div>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg font-inter"
              >
                Learn More <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              Comprehensive Mental Health Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter leading-relaxed">
              From initial screening to ongoing monitoring, we provide a complete suite of mental health assessment
              tools designed for modern healthcare professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <Users className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-playfair">Patient Management</h3>
              <p className="text-gray-600 font-inter">
                Comprehensive patient records, history tracking, and secure data management system.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <Calendar className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-playfair">Smart Scheduling</h3>
              <p className="text-gray-600 font-inter">
                Intelligent appointment scheduling with automated reminders and calendar integration.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-playfair">Analytics & Reports</h3>
              <p className="text-gray-600 font-inter">
                Detailed insights, progress tracking, and comprehensive reporting dashboard.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-50 to-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
              <Shield className="w-12 h-12 text-orange-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-playfair">Secure Platform</h3>
              <p className="text-gray-600 font-inter">
                Enterprise-grade security, privacy protection, and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              What Mental Health Professionals Say
            </h2>
            <p className="text-xl text-gray-600 font-inter">
              Trusted by leading psychologists and healthcare institutions worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 italic font-inter text-lg leading-relaxed">
                "This platform has revolutionized how we conduct initial assessments. The AI analysis provides insights
                that complement our clinical expertise perfectly. It's become indispensable in our practice."
              </p>
              <div className="flex items-center">
                <img
                  src="/dr-sarah.avif"
                  alt="Dr. Sarah Johnson - Clinical Psychologist"
                  className="w-14 h-14 rounded-full mr-4 object-cover shadow-lg"
                />
                <div>
                  <div className="font-semibold text-gray-900 font-playfair text-lg">Dr. Sarah Johnson</div>
                  <div className="text-sm text-gray-600 font-inter">Clinical Psychologist, Mayo Clinic</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 italic font-inter text-lg leading-relaxed">
                "The accuracy and speed of analysis is remarkable. It's become an essential tool in our practice for
                early detection and intervention. Our patient outcomes have improved significantly."
              </p>
              <div className="flex items-center">
                <img
                  src="/dr-micheal.avif"
                  alt="Dr. Michael Chen - Psychiatrist"
                  className="w-14 h-14 rounded-full mr-4 object-cover shadow-lg"
                />
                <div>
                  <div className="font-semibold text-gray-900 font-playfair text-lg">Dr. Michael Chen</div>
                  <div className="text-sm text-gray-600 font-inter">Psychiatrist, Johns Hopkins</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 italic font-inter text-lg leading-relaxed">
                "The comprehensive dashboard and patient management features have streamlined our workflow
                significantly. The integration capabilities are outstanding. Highly recommended!"
              </p>
              <div className="flex items-center">
                <img
                  src="/dr-sarah.avif"
                  alt="Dr. Emily Rodriguez - Therapy Director"
                  className="w-14 h-14 rounded-full mr-4 object-cover shadow-lg"
                />
                <div>
                  <div className="font-semibold text-gray-900 font-playfair text-lg">Dr. Emily Rodriguez</div>
                  <div className="text-sm text-gray-600 font-inter">Therapy Director, Stanford Health</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 font-playfair">
            Ready to Transform Mental Health Care?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed font-inter max-w-3xl mx-auto">
            Join thousands of mental health professionals who are already using our AI-powered platform to provide
            better care and insights for their patients. Experience the future of psychological assessment today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-inter"
            >
              See Our Psychologist Portal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 bg-transparent font-inter"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold font-playfair">PsychPortal</span>
              </div>
              <p className="text-gray-400 font-inter leading-relaxed">
                AI-powered mental health analysis platform for healthcare professionals. Revolutionizing psychological
                assessment through advanced technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 font-playfair">Platform</h3>
              <ul className="space-y-3 text-gray-400 font-inter">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 font-playfair">Support</h3>
              <ul className="space-y-3 text-gray-400 font-inter">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 font-playfair">Company</h3>
              <ul className="space-y-3 text-gray-400 font-inter">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 font-inter">
            <p>
              &copy; 2024 PsychPortal. All rights reserved. Psychological Distress Inference System powered by Advanced
              AI Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}