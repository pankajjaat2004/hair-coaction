"use client"

import type React from "react"
import { useState } from "react"
import {
  Home,
  BookOpen,
  User,
  Settings,
  Heart,
  Calendar,
  Star,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: { displayName?: string | null };
  darkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "from-pink-500 to-rose-400", path: "/" },
    { id: "education", label: "Education", icon: BookOpen, color: "from-orange-400 to-pink-400", path: "/education" },
    {
      id: "consultation",
      label: "Consultation",
      icon: Stethoscope,
      color: "from-pink-500 to-rose-400",
      path: "/consultation",
    },
    { id: "event", label: "Event", icon: Calendar, color: "from-orange-400 to-pink-500", path: "/event" },
    { id: "community", label: "Community", icon: Users, color: "from-purple-500 to-pink-500", path: "/community" }, // Added Community section
  ]

  const quickActions = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = [
    { label: "Health Score", value: "8.5/10", icon: Heart, gradient: "from-pink-400 to-rose-400" },
    { label: "Streak Days", value: "12", icon: Calendar, gradient: "from-rose-400 to-pink-500" },
    { label: "Products Used", value: "24", icon: Star, gradient: "from-pink-500 to-orange-400" },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
             opacity: 0;
             transform: translateX(-20px);
           }
          to {
             opacity: 1;
             transform: translateX(0);
           }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
             opacity: 0;
             transform: scale(0.95);
           }
          to {
             opacity: 1;
             transform: scale(1);
           }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        .animate-pulse-gentle {
          animation: pulse 2s infinite;
        }
        
        .sidebar-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift {
          transition: all 0.2s ease-out;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-pink-500 to-rose-400 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700" : "bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50 border-r border-pink-100"} shadow-2xl z-40 sidebar-transition ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 animate-slideInLeft flex flex-col`}
      >
        {/* Header */}
  <div className={`p-6 border-b ${darkMode ? "border-gray-700 bg-gray-900/70" : "border-pink-100 bg-white/50"} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg animate-pulse-gentle">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uRedUWd49nAu0zdMZt4lz7mYgUvUnA.png"
                      alt="Hair Coaction Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold bg-clip-text text-transparent ${darkMode ? "bg-gradient-to-r from-gray-300 to-gray-500" : "bg-gradient-to-r from-pink-600 to-rose-600"}`}>
                      Hair Coaction
                    </h1>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Hair Care</p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`hidden lg:flex p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? "hover:bg-gray-800" : "hover:bg-pink-100"}`}
            >
              <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"} sidebar-transition ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="p-6 animate-fadeIn">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Quick Stats</h3>
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover-lift animate-scaleIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`bg-gradient-to-r ${stat.gradient} w-10 h-10 rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="px-6 py-4">
            <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-700"} mb-4 uppercase tracking-wide ${isCollapsed ? 'text-center' : ''}`}>
              {isCollapsed ? '•••' : 'Navigation'}
            </h3>
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover-lift animate-scaleIn ${
                    activeTab === item.id
                      ? darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg" : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-white" : 'text-gray-700 hover:bg-white/70 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                  {!isCollapsed && activeTab === item.id && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse-gentle" />
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-pink-100 mt-auto">
            <h3 className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-700"} mb-4 uppercase tracking-wide ${isCollapsed ? 'text-center' : ''}`}>
              {isCollapsed ? '•••' : 'Quick Actions'}
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, index) =>
                action.id === "profile" ? (
                  <Link
                    key={action.id}
                    to="/profile"
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover-lift animate-scaleIn ${
                      darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-white/70 hover:text-gray-900"
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <action.icon className="w-5 h-5" />
                    {!isCollapsed && <span>{action.label}</span>}
                  </Link>
                ) : (
                  <button
                    key={action.id}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-white/70 hover:text-gray-900 transition-all duration-300 hover-lift animate-scaleIn ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <action.icon className="w-5 h-5" />
                    {!isCollapsed && <span>{action.label}</span>}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className={`p-6 border-t ${darkMode ? "border-gray-700 bg-gray-900/70" : "border-pink-100 bg-white/30"} backdrop-blur-sm`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-pink-500 to-rose-400"}`}>
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 animate-fadeIn">
                <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{user?.displayName || "User"}</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Premium Member</p>
              </div>
            )}
            {!isCollapsed && (
              <button className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? "hover:bg-gray-800" : "hover:bg-pink-100"}`}>
                <LogOut className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className={`hidden lg:block sidebar-transition ${isCollapsed ? "w-20" : "w-80"}`} />
    </>
  )
}

export default Sidebar
