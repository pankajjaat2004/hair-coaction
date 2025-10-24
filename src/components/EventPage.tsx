"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Calendar,
  Brain,
  Star,
  BookOpen,
  Award,
  Clock,
  UserCheck,
  Trophy,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
} from "lucide-react"
import Sidebar from "./Sidebar" // Import Sidebar
import QuizModal from './QuizModal';

const quizQuestionsMap: Record<string, import('./QuizModal').QuizQuestion[]> = {
  'Hair Analysis Fundamentals': [
    { question: 'What is the primary tool for scalp microscopy?', options: ['Trichoscope', 'Stethoscope', 'Otoscope', 'Endoscope'], type: 'multiple' },
    { question: 'Name one key indicator of scalp health.', type: 'text' },
    { question: 'Which layer of hair is analyzed for cuticle damage?', options: ['Cortex', 'Medulla', 'Cuticle', 'Follicle'], type: 'multiple' },
  ],
  'Future Hair Restoration Technologies': [
    { question: 'Which technology uses automation for hair transplantation?', options: ['Robotic Transplant', 'Laser Therapy', 'PRP', 'Microneedling'], type: 'multiple' },
    { question: 'What does AI help diagnose in hair restoration?', type: 'text' },
    { question: 'Stem cell therapy is primarily used for?', options: ['Regrowth', 'Coloring', 'Straightening', 'Cleaning'], type: 'multiple' },
  ],
  'Hormonal Hair Loss Mechanisms': [
    { question: 'Which hormone is most linked to hair loss?', options: ['DHT', 'Insulin', 'Estrogen', 'Cortisol'], type: 'multiple' },
    { question: 'Describe a treatment protocol for hormonal hair loss.', type: 'text' },
    { question: 'PCOS affects hair by causing?', options: ['Thinning', 'Thickening', 'Color Change', 'No Effect'], type: 'multiple' },
  ],
  'Dermatoscopy Essentials': [
    { question: 'Dermatoscopy is used to examine?', options: ['Hair & Scalp', 'Nails', 'Teeth', 'Eyes'], type: 'multiple' },
    { question: 'What is a common sign of alopecia in dermatoscopy?', type: 'text' },
    { question: 'Which tool is essential for dermatoscopy?', options: ['Dermatoscope', 'Microscope', 'Camera', 'Ruler'], type: 'multiple' },
  ],
  'Alopecia Areata Treatment Update': [
    { question: 'JAK inhibitors are used to treat?', options: ['Alopecia Areata', 'Dandruff', 'Psoriasis', 'Eczema'], type: 'multiple' },
    { question: 'Name a new immunotherapy for alopecia.', type: 'text' },
    { question: 'What is a key goal of new treatments?', options: ['Regrowth', 'Coloring', 'Straightening', 'No Effect'], type: 'multiple' },
  ],
  'Hair Transplant Planning Basics': [
    { question: 'What is the first step in transplant planning?', options: ['Consultation', 'Surgery', 'Medication', 'Shaving'], type: 'multiple' },
    { question: 'How is graft calculation performed?', type: 'text' },
    { question: 'Which design is important for natural look?', options: ['Hairline', 'Eyebrow', 'Beard', 'Moustache'], type: 'multiple' },
  ],
};

import type { User as FirebaseUser } from "firebase/auth";

interface EventpagesProps {
  user: FirebaseUser;
}

const EventsPage: React.FC<EventpagesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [animateCards, setAnimateCards] = useState(false)
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<null | typeof quizzes[0]>(null);

  useEffect(() => {
    // Simulate loading and trigger animations
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAnimateCards(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Reset and trigger animations when tab changes
    setAnimateCards(false)
    const timer = setTimeout(() => setAnimateCards(true), 100)
    return () => clearTimeout(timer)
  }, [activeTab])

  const eventCategories = [
    {
      title: "Workshops",
      description: "Online sessions led by dermatologists and trichologists",
      icon: Users,
      color: "from-pink-400 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      tab: "workshops",
      count: "12+ Sessions",
    },
    {
      title: "Seminars",
      description: "Virtual events discussing research and trends",
      icon: Calendar,
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-100",
      tab: "seminars",
      count: "8+ Events",
    },
    {
      title: "Quizzes",
      description: "Recap and reinforce learning from seminars and workshops",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-100",
      tab: "quizzes",
      count: "25+ Quizzes",
    },
  ]

  const highlights = [
    {
      icon: Star,
      title: "Expert Knowledge",
      description: "Learn from leading dermatologists and trichologists worldwide",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: BookOpen,
      title: "Hands-on Learning",
      description: "Interactive workshops with practical demonstrations and case studies",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: Award,
      title: "Latest Research",
      description: "Stay updated with cutting-edge research and industry innovations",
      color: "from-green-400 to-teal-500",
    },
  ]

  const workshops = [
    {
      title: "Interactive Hair Analysis Techniques",
      speaker: "Dr. Sarah Chen",
      speakerTitle: "Lead Trichologist, Hair Health Institute",
      date: "March 15, 2025",
      time: "2:00 PM - 4:00 PM EST",
      rating: 4.8,
      topics: ["Hair Microscopy", "Scalp Analysis", "Diagnostic Tools", "Case Studies"],
      participants: 145,
      featured: true,
    },
    {
      title: "Advanced Dermatoscopy for Hair Disorders",
      speaker: "Prof. Michael Rodriguez",
      speakerTitle: "Professor of Dermatology, Medical University",
      date: "March 22, 2025",
      time: "10:00 AM - 12:00 PM EST",
      rating: 4.9,
      topics: ["Dermatoscopy Basics", "Pattern Recognition", "Alopecia Diagnosis", "Digital Imaging"],
      participants: 187,
      featured: false,
    },
    {
      title: "Hands-on Hair Transplant Planning",
      speaker: "Dr. Jennifer Park",
      speakerTitle: "Hair Restoration Surgeon, Elite Hair Clinic",
      date: "March 29, 2025",
      time: "3:00 PM - 5:00 PM EST",
      rating: 4.7,
      topics: ["Surgical Planning", "Graft Calculation", "Hairline Design", "Patient Consultation"],
      participants: 203,
      featured: false,
    },
  ]

  const seminars = [
    {
      title: "Future of Hair Restoration: 2025 Innovations",
      speaker: "Dr. Alexander Martinez",
      credentials: "MD, PhD, Hair Restoration Specialist",
      date: "March 18, 2025",
      time: "1:00 PM - 2:30 PM EST",
      registeredUsers: 324,
      rating: 4.9,
      topics: ["Robotic Hair Transplants", "Stem Cell Therapy", "AI Diagnostics", "3D Hair Modeling", "Gene Therapy"],
      trending: true,
    },
    {
      title: "Hormonal Hair Loss: Latest Research Findings",
      speaker: "Prof. David Thompson",
      credentials: "PhD, Endocrinology & Trichology Research",
      date: "March 25, 2025",
      time: "11:00 AM - 12:30 PM EST",
      registeredUsers: 412,
      rating: 4.8,
      topics: ["Hormonal Pathways", "PCOS Hair Loss", "Thyroid Effects", "Treatment Protocols", "Clinical Studies"],
      trending: false,
    },
    {
      title: "Alopecia Areata: New Treatment Approaches",
      speaker: "Dr. Lisa Chang",
      credentials: "MD, Dermatology & Autoimmune Disorders",
      date: "April 1, 2025",
      time: "4:00 PM - 5:30 PM EST",
      registeredUsers: 267,
      rating: 4.7,
      topics: ["JAK Inhibitors", "Immunotherapy", "Patient Care", "Quality of Life", "Research Updates"],
      trending: false,
    },
    {
      title: "Scalp Microbiome and Hair Health",
      speaker: "Prof. Robert Kim",
      credentials: "PhD, Microbiology & Dermatological Research",
      date: "April 8, 2025",
      time: "2:00 PM - 3:30 PM EST",
      registeredUsers: 156,
      rating: 4.6,
      topics: ["Microbiome Analysis", "Bacterial Balance", "Probiotic Treatments", "Scalp Health", "Future Directions"],
      trending: false,
    },
  ]

  const quizzes = [
    {
      title: "Hair Analysis Fundamentals",
      description: "Test your knowledge on microscopy techniques and scalp analysis methods",
      relatedEvent: "Interactive Hair Analysis Techniques Workshop",
      questions: 15,
      duration: "20 minutes",
      difficulty: "Intermediate",
      rating: 4.7,
      completions: 89,
      popular: false,
    },
    {
      title: "Future Hair Restoration Technologies",
      description: "Quiz covering robotic transplants, stem cell therapy, and AI diagnostics",
      relatedEvent: "Future of Hair Restoration: 2025 Innovations Seminar",
      questions: 20,
      duration: "25 minutes",
      difficulty: "Advanced",
      rating: 4.9,
      completions: 156,
      popular: true,
    },
    {
      title: "Hormonal Hair Loss Mechanisms",
      description: "Comprehensive quiz on hormonal pathways and treatment protocols",
      relatedEvent: "Hormonal Hair Loss: Latest Research Findings Seminar",
      questions: 18,
      duration: "22 minutes",
      difficulty: "Advanced",
      rating: 4.8,
      completions: 203,
      popular: true,
    },
    {
      title: "Dermatoscopy Essentials",
      description: "Practice identifying hair disorders through dermatoscopic images",
      relatedEvent: "Advanced Dermatoscopy for Hair Disorders Workshop",
      questions: 12,
      duration: "15 minutes",
      difficulty: "Beginner",
      rating: 4.6,
      completions: 67,
      popular: false,
    },
    {
      title: "Alopecia Areata Treatment Update",
      description: "Quiz on new treatments including JAK inhibitors and immunotherapy",
      relatedEvent: "Alopecia Areata: New Treatment Approaches Seminar",
      questions: 16,
      duration: "18 minutes",
      difficulty: "Intermediate",
      rating: 4.7,
      completions: 124,
      popular: false,
    },
    {
      title: "Hair Transplant Planning Basics",
      description: "Test your understanding of surgical planning and graft calculations",
      relatedEvent: "Hands-on Hair Transplant Planning Workshop",
      questions: 14,
      duration: "20 minutes",
      difficulty: "Intermediate",
      rating: 4.5,
      completions: 98,
      popular: false,
    },
  ]

  const topicColors = [
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const renderOverview = () => (
    <div
      className={`transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Hero Section */}
      <div className="relative mb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <div className="inline-flex items-center px-6 py-2 mb-6 border border-pink-100 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 mr-2 text-pink-500 animate-pulse" />
            <span className="font-semibold text-pink-700">Welcome to Hair Coaction Events</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 via-orange-500 to-pink-600 bg-clip-text">
            Hair Coaction Events
          </h1>
          <p className="max-w-4xl px-4 mx-auto text-lg leading-relaxed text-gray-700 sm:text-xl">
            Join our comprehensive platform dedicated to hair health, dermatology, and trichology. Explore workshops,
            seminars, and interactive learning opportunities designed by experts.
          </p>
        </div>
      </div>

      {/* Event Categories */}
      <div className="grid gap-6 px-4 mb-20 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {eventCategories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <button
                onClick={() => setActiveTab(category.tab)}
                className="block w-full text-left transition-all duration-500 transform group hover:scale-105 hover:-translate-y-2"
              >
                <div
                  className={`bg-gradient-to-br ${category.bgColor} rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl border border-white/50 backdrop-blur-sm relative overflow-hidden`}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 transition-transform duration-700 transform translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-white to-transparent group-hover:scale-150"></div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`bg-gradient-to-r ${category.color} w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white lg:h-8 lg:w-8" />
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 text-xs font-semibold text-gray-600 rounded-full lg:text-sm bg-white/70">
                          {category.count}
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-4 text-xl font-bold text-gray-800 lg:text-2xl">{category.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-gray-600 lg:text-base">{category.description}</p>
                    <div className="flex items-center font-semibold text-pink-600 group-hover:text-pink-700">
                      <span className="text-sm lg:text-base">Explore {category.title}</span>
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 lg:h-5 lg:w-5 group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Why Choose HairCoaction Events */}
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-pink-100 relative overflow-hidden transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-20 h-20 rounded-full top-10 left-10 bg-gradient-to-r from-pink-200 to-orange-200 opacity-20 animate-pulse"></div>
          <div
            className="absolute w-32 h-32 rounded-full bottom-10 right-10 bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative">
          <h2 className="mb-12 text-3xl font-bold text-center text-transparent lg:text-4xl bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text">
            Why Choose Hair Coaction Events?
          </h2>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon
              return (
                <div
                  key={index}
                  className={`text-center group transform transition-all duration-700 hover:scale-105 ${
                    animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 200}ms` }}
                >
                  <div
                    className={`bg-gradient-to-r ${highlight.color} w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white lg:h-10 lg:w-10" />
                  </div>
                  <h3 className="mb-4 text-lg font-bold text-gray-800 lg:text-xl">{highlight.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 lg:text-base">{highlight.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderWorkshops = () => (
    <div
      className={`space-y-8 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="px-4 mb-12 text-center">
        <div className="inline-flex items-center px-6 py-2 mb-6 border border-pink-100 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
          <Users className="w-5 h-5 mr-2 text-pink-500" />
          <span className="font-semibold text-pink-700">Interactive Learning</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text">
          Upcoming Workshops
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 lg:text-xl">
          Join our interactive online sessions led by expert dermatologists and trichologists
        </p>
      </div>

      <div className="px-4 space-y-6 lg:space-y-8">
        {workshops.map((workshop, index) => (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pink-100 group hover:-translate-y-2 transform ${
              animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {workshop.featured && (
              <div className="py-2 text-sm font-semibold text-center text-white bg-gradient-to-r from-pink-500 to-orange-500">
                <Zap className="inline w-4 h-4 mr-1" />
                Featured Workshop
              </div>
            )}

            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-300 lg:text-2xl group-hover:text-pink-700">
                    {workshop.title}
                  </h3>

                  <div className="p-4 mb-4 border border-pink-100 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
                    <p className="text-lg font-semibold text-pink-700">{workshop.speaker}</p>
                    <p className="text-sm text-gray-600 lg:text-base">{workshop.speakerTitle}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6 text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Calendar className="flex-shrink-0 w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm lg:text-base">{workshop.date}</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Clock className="flex-shrink-0 w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm lg:text-base">{workshop.time}</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Star className="flex-shrink-0 w-5 h-5 mr-2 text-yellow-500" />
                      <span className="text-sm font-semibold lg:text-base">{workshop.rating}/5.0</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Users className="flex-shrink-0 w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm lg:text-base">{workshop.participants} registered</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="flex items-center mb-3 font-semibold text-gray-800">
                      <Target className="w-4 h-4 mr-2 text-pink-500" />
                      Key Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {workshop.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-2 text-xs font-medium text-pink-700 transition-transform duration-200 border border-pink-200 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 lg:text-sm hover:scale-105"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:ml-8 lg:flex-shrink-0 lg:mt-0">
                  <button className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg lg:w-auto bg-gradient-to-r from-pink-500 to-orange-500 lg:px-8 lg:py-4 rounded-xl hover:from-pink-600 hover:to-orange-600 hover:scale-105 hover:shadow-xl group-hover:animate-pulse">
                    Reserve Your Spot
                  </button>
                  <p className="mt-2 text-xs text-center text-gray-500 lg:text-sm lg:text-left">
                    Limited seats available
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSeminars = () => (
    <div
      className={`space-y-8 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="px-4 mb-12 text-center">
        <div className="inline-flex items-center px-6 py-2 mb-6 border border-pink-100 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
          <Calendar className="w-5 h-5 mr-2 text-pink-500" />
          <span className="font-semibold text-pink-700">Research & Trends</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text">
          Featured Upcoming Seminars
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 lg:text-xl">
          Virtual events discussing the latest research and trends in hair health and trichology
        </p>
      </div>

      <div className="px-4 space-y-6 lg:space-y-8">
        {seminars.map((seminar, index) => (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pink-100 group hover:-translate-y-2 transform ${
              animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {seminar.trending && (
              <div className="py-2 text-sm font-semibold text-center text-white bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="inline w-4 h-4 mr-1 animate-pulse" />
                Trending Seminar
              </div>
            )}

            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-300 lg:text-2xl group-hover:text-pink-700">
                    {seminar.title}
                  </h3>

                  <div className="p-4 mb-4 border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-lg font-semibold text-purple-700">{seminar.speaker}</p>
                    <p className="text-sm text-gray-600 lg:text-base">{seminar.credentials}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6 text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Calendar className="flex-shrink-0 w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm lg:text-base">{seminar.date}</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Clock className="flex-shrink-0 w-5 h-5 mr-2 text-pink-500" />
                      <span className="text-sm lg:text-base">{seminar.time}</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <UserCheck className="flex-shrink-0 w-5 h-5 mr-2 text-green-500" />
                      <span className="text-sm lg:text-base">{seminar.registeredUsers} registered</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gray-50">
                      <Star className="flex-shrink-0 w-5 h-5 mr-2 text-yellow-500" />
                      <span className="text-sm font-semibold lg:text-base">{seminar.rating}/5.0</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="flex items-center mb-3 font-semibold text-gray-800">
                      <Target className="w-4 h-4 mr-2 text-pink-500" />
                      Key Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {seminar.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className={`${topicColors[topicIndex % topicColors.length]} px-3 py-2 rounded-full text-xs lg:text-sm font-medium border hover:scale-105 transition-transform duration-200`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:ml-8 lg:flex-shrink-0 lg:mt-0">
                  <button className="w-full px-6 py-3 mb-2 font-semibold text-white transition-all duration-300 transform shadow-lg lg:w-auto bg-gradient-to-r from-purple-500 to-pink-500 lg:px-8 lg:py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-xl group-hover:animate-pulse">
                    Reserve Your Spot
                  </button>
                  <p className="text-xs text-center text-gray-600 lg:text-sm lg:text-left">Free for registered users</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuizzes = () => (
    <div
      className={`transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="px-4 mb-12 text-center">
        <div className="inline-flex items-center px-6 py-2 mb-6 border border-pink-100 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
          <Brain className="w-5 h-5 mr-2 text-pink-500" />
          <span className="font-semibold text-pink-700">Test Your Knowledge</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text">
          Knowledge Quizzes
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 lg:text-xl">
          Recap and reinforce your learning from our seminars and workshops with interactive quizzes
        </p>
      </div>

      <div className="grid gap-6 px-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pink-100 group hover:-translate-y-2 transform ${
              animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {quiz.popular && (
              <div className="py-2 text-sm font-semibold text-center text-white bg-gradient-to-r from-yellow-400 to-orange-500">
                <Star className="inline w-4 h-4 mr-1" />
                Popular Quiz
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 transition-all duration-500 bg-gradient-to-r from-pink-100 to-orange-100 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl group-hover:scale-110 group-hover:rotate-6">
                  <Brain className="w-6 h-6 text-pink-600 lg:h-7 lg:w-7" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${getDifficultyColor(quiz.difficulty)}`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-gray-800 transition-colors duration-300 lg:text-xl group-hover:text-pink-700">
                {quiz.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-gray-600 lg:text-base">{quiz.description}</p>

              <div className="p-3 mb-4 border border-pink-100 rounded-lg bg-gradient-to-r from-pink-50 to-orange-50">
                <div className="flex items-center mb-1">
                  <BookOpen className="flex-shrink-0 w-4 h-4 mr-2 text-pink-600" />
                  <span className="text-xs font-medium text-pink-700 lg:text-sm">Related Event:</span>
                </div>
                <p className="text-xs font-medium text-pink-600 lg:text-sm">{quiz.relatedEvent}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-gray-600 lg:text-sm">
                <div className="flex items-center p-2 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-800">{quiz.questions}</span>
                  <span className="ml-1">questions</span>
                </div>
                <div className="flex items-center p-2 rounded-lg bg-gray-50">
                  <Clock className="flex-shrink-0 w-4 h-4 mr-1 text-pink-500" />
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center p-2 rounded-lg bg-gray-50">
                  <Star className="flex-shrink-0 w-4 h-4 mr-1 text-yellow-500" />
                  <span>{quiz.rating}/5.0</span>
                </div>
                <div className="flex items-center p-2 rounded-lg bg-gray-50">
                  <Trophy className="flex-shrink-0 w-4 h-4 mr-1 text-pink-500" />
                  <span>{quiz.completions} completed</span>
                </div>
              </div>

              <button
                className="w-full py-3 font-semibold text-white transition-all duration-300 transform shadow-md bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl hover:from-pink-600 hover:to-orange-600 hover:scale-105 hover:shadow-lg group-hover:animate-pulse"
                onClick={() => {
                  setActiveQuiz(quiz);
                  setQuizModalOpen(true);
                }}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          open={quizModalOpen}
          onClose={() => {
            setQuizModalOpen(false);
            setTimeout(() => setActiveQuiz(null), 300); // Delay to allow modal fade out
          }}
          quizTitle={activeQuiz.title}
          quizDescription={activeQuiz.description}
          questions={quizQuestionsMap[activeQuiz.title] || []}
        />
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-pink-500 rounded-full animate-spin border-t-transparent"></div>
          <p className="font-semibold text-pink-700">Loading Hair Coaction Events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100">
      {/* Sidebar */}
  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={undefined} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex justify-center px-4 pt-6 mb-8 lg:mb-12">
          <div className="p-2 overflow-x-auto border border-pink-100 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="flex space-x-2 min-w-max">
              {[
                { id: "overview", label: "Overview", icon: Sparkles },
                { id: "workshops", label: "Workshops", icon: Users },
                { id: "seminars", label: "Seminars", icon: Calendar },
                { id: "quizzes", label: "Quizzes", icon: Brain },
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-pink-600 hover:bg-pink-50 hover:scale-105"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2 lg:h-5 lg:w-5" />
                    <span className="text-sm lg:text-base">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 pb-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "workshops" && renderWorkshops()}
            {activeTab === "seminars" && renderSeminars()}
            {activeTab === "quizzes" && renderQuizzes()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsPage
