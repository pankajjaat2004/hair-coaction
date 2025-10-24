interface ConsultationProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode?: boolean;
}
import React, { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  Send,
  Bot,
  Stethoscope,
  Microscope,
  Star,
  Phone,
  Video,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  Shield,
  Award,
} from "lucide-react"


interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "specialist";
  timestamp: Date;
  type?: "text" | "suggestion" | "appointment";
}

interface Specialist {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  availability: string;
  specialties: string[];
}

const Consultation: React.FC<ConsultationProps> = ({ user, activeTab, setActiveTab, darkMode }) => {
  const [activeChat, setActiveChat] = useState<"chatbot" | "dermatology" | "trichology">("chatbot");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    chatbot: [
      {
        id: "1",
        text: "Hello! I'm your AI Hair Care Assistant. I can help you with hair care routines, product recommendations, and general hair health questions. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ],
    dermatology: [
      {
        id: "1",
        text: "Welcome to Dermatology Consultation. I'm here to help with scalp conditions, hair loss concerns, and medical hair treatments. Please describe your concern.",
        sender: "specialist",
        timestamp: new Date(),
      },
    ],
    trichology: [
      {
        id: "1",
        text: "Hello! I'm your Trichology specialist. I focus on hair and scalp health, hair structure analysis, and specialized treatments. What would you like to discuss?",
        sender: "specialist",
        timestamp: new Date(),
      },
    ],
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSpecialist, setExpandedSpecialist] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const GEMINI_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage],
    }));
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: inputText }] }],
          }),
        }
      );
      const data = await res.json();
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      const response: Message = {
        id: Date.now().toString(),
        text: geminiText,
        sender: activeChat === "chatbot" ? "bot" : "specialist",
        timestamp: new Date(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...prev[activeChat], response],
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...prev[activeChat], {
          id: Date.now().toString(),
          text: "Error generating response. Please try again.",
          sender: activeChat === "chatbot" ? "bot" : "specialist",
          timestamp: new Date(),
        }],
      }));
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getChatIcon = (chatType: string) => {
    switch (chatType) {
      case "chatbot":
        return <Bot className="w-5 h-5" />;
      case "dermatology":
        return <Stethoscope className="w-5 h-5" />;
      case "trichology":
        return <Microscope className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getChatTitle = (chatType: string) => {
    switch (chatType) {
      case "chatbot":
        return "AI Hair Assistant";
      case "dermatology":
        return "Dermatology Consultation";
      case "trichology":
        return "Trichology Consultation";
      default:
        return "Chat";
    }
  };

  const renderSpecialistCard = (specialist: Specialist, type: string) => (
    <div
      key={specialist.id}
      className="bg-white rounded-xl shadow-md p-4 border border-pink-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{specialist.name}</h4>
          <p className="text-sm text-pink-600 font-medium">
            {specialist.title}
          </p>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {specialist.rating}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              • {specialist.experience} exp
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              specialist.availability.includes("Available")
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {specialist.availability}
          </span>
        </div>
      </div>
      <div className="mb-3">
        <button
          onClick={() =>
            setExpandedSpecialist(
              expandedSpecialist === specialist.id ? null : specialist.id
            )
          }
          className="flex items-center text-sm text-pink-600 hover:text-pink-700"
        >
          Specialties
          {expandedSpecialist === specialist.id ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </button>
        {expandedSpecialist === specialist.id && (
          <div className="mt-2 flex flex-wrap gap-1">
            {specialist.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-pink-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors flex items-center justify-center">
          <Video className="w-4 h-4 mr-1" />
          Video Call
        </button>
        <button className="flex-1 bg-pink-100 text-pink-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors flex items-center justify-center">
          <Calendar className="w-4 h-4 mr-1" />
          Schedule
        </button>
      </div>
    </div>
  );
  // ...existing code...
  const specialists: Record<string, Specialist[]> = {
    dermatology: [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        title: "Board-Certified Dermatologist",
        experience: "12 years",
        rating: 4.9,
        availability: "Available Today",
        specialties: ["Hair Loss", "Scalp Conditions", "Alopecia Treatment"],
      },
      {
        id: "2",
        name: "Dr. Michael Chen",
        title: "Dermatologist & Hair Specialist",
        experience: "8 years",
        rating: 4.8,
        availability: "Next Available: Tomorrow",
        specialties: [
          "Androgenic Alopecia",
          "Scalp Dermatitis",
          "Hair Transplant",
        ],
      },
    ],
    trichology: [
      {
        id: "1",
        name: "Emma Rodriguez",
        title: "Certified Trichologist",
        experience: "10 years",
        rating: 4.9,
        availability: "Available Now",
        specialties: [
          "Hair Analysis",
          "Scalp Health",
          "Hair Growth Treatments",
        ],
      },
      {
        id: "2",
        name: "James Wilson",
        title: "Senior Trichologist",
        experience: "15 years",
        rating: 4.7,
        availability: "Available Today",
        specialties: [
          "Hair Breakage",
          "Chemical Damage",
          "Hair Restoration",
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getChatIcon(activeChat)}
                  <h3 className="ml-3 text-lg font-semibold">
                    {getChatTitle(activeChat)}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {activeChat !== "chatbot" && (
                    <>
                      <button className="p-2 hover:bg-pink-600 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-pink-600 rounded-lg transition-colors">
                        <Video className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm">Online</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-25 to-white">
              {messages[activeChat].map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-pink-500 text-white"
                        : message.sender === "bot"
                        ? "bg-white border border-pink-200 text-gray-800"
                        : "bg-rose-50 border border-rose-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === "user"
                          ? "text-pink-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-pink-200 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-4 border-t border-pink-100 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask your ${
                    activeChat === "chatbot" ? "AI assistant" : "specialist"
                  } about hair care...`}
                  className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Available Specialists */}
          {activeChat !== "chatbot" && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-pink-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-pink-500 mr-2" />
                Available{" "}
                {activeChat === "dermatology"
                  ? "Dermatologists"
                  : "Trichologists"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialists[activeChat]?.map((specialist) =>
                  renderSpecialistCard(specialist, activeChat)
                )}
              </div>
            </div>
          )}
        </div>
        {/* Specialists Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all">
                Emergency Hair Consultation
              </button>
              <button className="w-full bg-pink-100 text-pink-700 py-3 px-4 rounded-xl font-medium hover:bg-pink-200 transition-colors">
                Schedule Regular Check-up
              </button>
              <button className="w-full bg-rose-100 text-rose-700 py-3 px-4 rounded-xl font-medium hover:bg-rose-200 transition-colors">
                Hair Analysis Report
              </button>
            </div>
          </div>
          {/* Trust Indicators */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-pink-500 mr-2" />
              Why Trust Our Experts?
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  Board-certified dermatologists and licensed trichologists
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  Specialized in hair and scalp health with years of
                  experience
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  Confidential consultations with personalized treatment
                  plans
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Available for follow-up care and ongoing support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consultation
