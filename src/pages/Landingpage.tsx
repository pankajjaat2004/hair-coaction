import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, Award, Zap, Shield, TrendingUp, Heart, Check, Mail, Phone, MapPin, Play, ChevronDown, Menu, X, Moon, Sun, Calendar, BookOpen, MessageCircle, BarChart3, Lock, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Check on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Founder images (replace with your actual JPG paths)
  const founderImages = {
    sarah: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    michael: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900' 
        : 'bg-gradient-to-br from-pink-50 via-orange-50 to-rose-100'
    }`}>
      {/* Enhanced Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[10%] left-[10%] w-2 h-2 rounded-full animate-float opacity-60 ${
          darkMode ? 'bg-pink-400' : 'bg-pink-400'
        }`}></div>
        <div className={`absolute top-[20%] right-[15%] w-1 h-1 rounded-full animate-float-delay-1 opacity-40 ${
          darkMode ? 'bg-orange-400' : 'bg-orange-400'
        }`}></div>
        <div className={`absolute top-[60%] left-[5%] w-3 h-3 rounded-full animate-float-delay-2 opacity-50 ${
          darkMode ? 'bg-rose-400' : 'bg-rose-400'
        }`}></div>
        <div className={`absolute bottom-[30%] right-[20%] w-1.5 h-1.5 rounded-full animate-float-delay-3 opacity-60 ${
          darkMode ? 'bg-pink-500' : 'bg-pink-500'
        }`}></div>
        <div className={`absolute top-[80%] left-[70%] w-2 h-2 rounded-full animate-float opacity-40 ${
          darkMode ? 'bg-orange-500' : 'bg-orange-500'
        }`}></div>
      </div>

      {/* Enhanced 3D Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full blur-3xl animate-blob-3d ${
          darkMode 
            ? 'bg-gradient-to-br from-pink-600/20 via-rose-600/15 to-orange-500/20' 
            : 'bg-gradient-to-br from-pink-400/30 via-rose-400/20 to-orange-300/30'
        }`} />
        <div className={`absolute bottom-[-20%] right-[-15%] w-[45vw] h-[45vw] rounded-full blur-3xl animate-blob-3d-delay-2 ${
          darkMode 
            ? 'bg-gradient-to-br from-orange-500/15 via-pink-500/20 to-rose-600/15' 
            : 'bg-gradient-to-br from-orange-300/20 via-pink-300/30 to-rose-400/20'
        }`} />
        <div className={`absolute top-[40%] left-[70%] w-[30vw] h-[30vw] rounded-full blur-2xl animate-blob-3d-delay-4 ${
          darkMode 
            ? 'bg-gradient-to-br from-rose-500/10 via-pink-400/15 to-orange-400/10' 
            : 'bg-gradient-to-br from-rose-300/15 via-pink-200/25 to-orange-200/20'
        }`} />
      </div>

      {/* Professional Navigation - Mobile Responsive */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? darkMode 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-pink-800/30' 
            : 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-pink-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                HairCoaction
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'About', 'Team', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`font-semibold transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'
                }`}>
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-gray-800 text-pink-400 hover:bg-gray-700' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className={`px-4 md:px-6 py-2 md:py-3 font-semibold rounded-xl transition-all duration-300 ${
                darkMode ? 'text-pink-400 hover:bg-gray-800' : 'text-pink-600 hover:bg-pink-50'
              }`}>
                Sign In
              </button>
              <button className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg text-sm md:text-base">
                Get Started
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-pink-50'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full backdrop-blur-xl border-b shadow-2xl ${
            darkMode ? 'bg-gray-900/95 border-pink-800/30' : 'bg-white/95 border-pink-100'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {['Features', 'Pricing', 'About', 'Team', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className={`block font-semibold py-3 text-lg ${
                    darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-pink-800/30 space-y-3">
                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    darkMode ? 'bg-gray-800 text-pink-400' : 'bg-pink-50 text-pink-600'
                  }`}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  darkMode ? 'text-pink-400 hover:bg-gray-800' : 'text-pink-600 hover:bg-pink-50'
                }`}>
                  Sign In
                </button>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Professional Hero Section - Mobile Responsive */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <div className={`inline-flex items-center px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                  darkMode 
                    ? 'bg-pink-900/30 text-pink-300 border border-pink-800/30' 
                    : 'bg-pink-100 text-pink-700 border border-pink-200'
                }`}>
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Trusted by 50,000+ Professionals
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text animate-gradient-x">
                    Transform
                  </span>
                  <span className={`block mt-1 md:mt-2 text-3xl md:text-6xl lg:text-7xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Hair Journey
                  </span>
                </h1>
                <p className={`text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Join the ultimate platform for hair care professionals and enthusiasts. Connect, learn, and grow with our vibrant community of experts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
                <button className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500 text-white rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:scale-105 hover:shadow-pink-200/50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className={`group px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg border-2 ${
                  darkMode 
                    ? 'bg-gray-800/70 backdrop-blur-xl border-pink-700/50 text-pink-300 hover:bg-gray-700/70' 
                    : 'bg-white/70 backdrop-blur-xl border-pink-200 text-pink-600 hover:bg-white/90'
                }`}>
                  <Play className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-4 md:pt-6">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className={`font-medium text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>50,000+ professionals</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className={`font-medium ml-2 text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Enhanced 3D Hero Visual - Mobile Responsive */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
                {/* Main Hero Card */}
                <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 animate-float transform hover:scale-105 transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gray-800/80 backdrop-blur-2xl border-pink-700/50' 
                    : 'bg-white/80 backdrop-blur-2xl border-white/50'
                }`}>
                  <img 
                    src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" 
                    alt="Hair Care Professional" 
                    className="w-full h-48 md:h-80 object-cover"
                  />
                  <div className={`p-4 md:p-6 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-800/90 to-pink-900/30' 
                      : 'bg-gradient-to-r from-pink-50 to-rose-50'
                  }`}>
                    <h3 className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Professional Hair Care</h3>
                    <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expert guidance for your hair journey</p>
                  </div>
                </div>

                {/* Enhanced Floating Elements - Hidden on mobile */}
                {!isMobile && (
                  <>
                    <div className={`absolute -top-8 -left-8 rounded-2xl p-4 shadow-2xl animate-float-delay-1 border ${
                      darkMode 
                        ? 'bg-gray-800/90 backdrop-blur-xl border-pink-700/30' 
                        : 'bg-white/90 backdrop-blur-xl border-pink-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>50,000+</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</p>
                        </div>
                      </div>
                    </div>

                    <div className={`absolute -bottom-8 -right-8 rounded-2xl p-4 shadow-2xl animate-float-delay-2 border ${
                      darkMode 
                        ? 'bg-gray-800/90 backdrop-blur-xl border-orange-700/30' 
                        : 'bg-white/90 backdrop-blur-xl border-orange-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>98%</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</p>
                        </div>
                      </div>
                    </div>

                    <div className={`absolute top-1/2 -right-16 rounded-2xl p-4 shadow-2xl animate-float-delay-3 border ${
                      darkMode 
                        ? 'bg-gray-800/90 backdrop-blur-xl border-rose-700/30' 
                        : 'bg-white/90 backdrop-blur-xl border-rose-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>24/7</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Stats Section - Mobile Responsive */}
      <section className={`py-12 md:py-20 ${
        darkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/50 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: '50K+', label: 'Happy Customers', icon: Users },
              { value: '99%', label: 'Satisfaction Rate', icon: Heart },
              { value: '24/7', label: 'Expert Support', icon: Shield },
              { value: '500+', label: 'Hair Specialists', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div className={`text-2xl md:text-4xl font-black mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`font-medium text-xs md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section - Mobile Responsive */}
      <section id="features" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text mb-4 md:mb-6">
              Everything You Need
            </h2>
            <p className={`text-lg md:text-2xl max-w-4xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive tools and resources to transform your hair care journey and build your professional network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Calendar className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'Community Events',
                description: 'Join exclusive hair care events, workshops, and masterclasses with industry experts.',
                color: 'from-pink-500 to-rose-500'
              },
              {
                icon: <BookOpen className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'Professional Education',
                description: 'Access comprehensive courses and certifications to advance your hair care expertise.',
                color: 'from-rose-500 to-pink-500'
              },
              {
                icon: <MessageCircle className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'Expert Consultations',
                description: 'Get one-on-one advice from certified trichologists and hair care specialists.',
                color: 'from-pink-500 to-orange-500'
              },
              {
                icon: <BarChart3 className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'Progress Analytics',
                description: 'Monitor your hair health journey with advanced analytics and personalized insights.',
                color: 'from-orange-500 to-pink-500'
              },
              {
                icon: <Lock className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'Enterprise Security',
                description: 'Your data and privacy are protected with enterprise-grade security measures.',
                color: 'from-rose-500 to-orange-500'
              },
              {
                icon: <Zap className="h-8 w-8 md:h-12 md:w-12" />,
                title: 'AI-Powered Insights',
                description: 'Get personalized product and routine recommendations powered by advanced AI.',
                color: 'from-pink-600 to-rose-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-pink-600/10 to-rose-600/10' 
                    : 'bg-gradient-to-r from-pink-200/20 to-rose-200/20'
                }`}></div>
                <div className={`relative rounded-2xl md:rounded-3xl border p-6 md:p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/80 backdrop-blur-2xl border-pink-700/30' 
                    : 'bg-white/80 backdrop-blur-2xl border-white/50'
                }`}>
                  <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 md:mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={`text-base md:text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Founders Section - Mobile Responsive */}
      <section id="team" className={`py-12 md:py-20 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 via-pink-900/20 to-gray-800/50' 
          : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text mb-4 md:mb-6">
              Meet Our Founders
            </h2>
            <p className={`text-lg md:text-2xl max-w-4xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Passionate experts dedicated to revolutionizing the hair care industry through innovation and community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
            {/* Founder Sarah Johnson */}
            <div className="group relative">
              <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-r from-pink-600/20 to-rose-600/20' 
                  : 'bg-gradient-to-r from-pink-300/20 to-rose-300/20'
              }`}></div>
              <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl group-hover:scale-105 transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800/90 backdrop-blur-2xl border-pink-700/30' 
                  : 'bg-white/90 backdrop-blur-2xl border-white/50'
              }`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={founderImages.sarah}
                    alt="Sarah Johnson - Founder" 
                    className="w-full h-48 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="p-4 md:p-8">
                  <h3 className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sarah Johnson</h3>
                  <p className="text-lg md:text-xl text-pink-400 font-semibold mb-3 md:mb-4">Founder & CEO</p>
                  <p className={`text-base md:text-lg leading-relaxed mb-4 md:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    With over 15 years in the hair care industry, Sarah is a certified trichologist and passionate advocate for hair health education.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-pink-400" />
                      <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>sarah@haircoaction.com</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex space-x-2 md:space-x-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Co-Founder Michael Chen */}
            <div className="group relative">
              <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20' 
                  : 'bg-gradient-to-r from-orange-300/20 to-pink-300/20'
              }`}></div>
              <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl group-hover:scale-105 transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800/90 backdrop-blur-2xl border-orange-700/30' 
                  : 'bg-white/90 backdrop-blur-2xl border-white/50'
              }`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={founderImages.michael}
                    alt="Michael Chen - Co-Founder" 
                    className="w-full h-48 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="p-4 md:p-8">
                  <h3 className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Michael Chen</h3>
                  <p className="text-lg md:text-xl text-orange-400 font-semibold mb-3 md:mb-4">Co-Founder & CTO</p>
                  <p className={`text-base md:text-lg leading-relaxed mb-4 md:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    A tech visionary with expertise in AI and platform development, Michael brings cutting-edge technology to hair care.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
                      <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>michael@haircoaction.com</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex space-x-2 md:space-x-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Pricing Section - Mobile Responsive */}
      <section id="pricing" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text mb-4 md:mb-6">
              Choose Your Plan
            </h2>
            <p className={`text-lg md:text-2xl max-w-4xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Flexible pricing options to suit every professional and enthusiast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$29',
                period: '/month',
                description: 'Perfect for hair care enthusiasts',
                features: [
                  'Access to community events',
                  'Basic education resources',
                  'Monthly consultations',
                  'Progress tracking',
                  'Email support'
                ],
                color: 'from-pink-400 to-rose-400',
                popular: false
              },
              {
                name: 'Professional',
                price: '$79',
                period: '/month',
                description: 'Ideal for hair care professionals',
                features: [
                  'Everything in Starter',
                  'Unlimited consultations',
                  'Advanced analytics',
                  'Priority support',
                  'Professional certification',
                  'AI recommendations'
                ],
                color: 'from-orange-500 to-pink-500',
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$199',
                period: '/month',
                description: 'For salons and large teams',
                features: [
                  'Everything in Professional',
                  'Team management tools',
                  'Custom branding',
                  'API access',
                  'Dedicated account manager',
                  'Advanced integrations'
                ],
                color: 'from-pink-600 to-rose-600',
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative group ${plan.popular ? 'md:scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-pink-600/10 to-rose-600/10' 
                    : 'bg-gradient-to-r from-pink-200/20 to-rose-200/20'
                }`}></div>
                <div className={`relative rounded-2xl md:rounded-3xl border p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/90 backdrop-blur-2xl border-pink-700/30' 
                    : 'bg-white/90 backdrop-blur-2xl border-white/50'
                }`}>
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-sm md:text-base mb-4 md:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className={`text-3xl md:text-5xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                      <span className={`text-lg md:text-xl ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 md:space-y-4 mb-6 md:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 md:space-x-3">
                        <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                        <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-lg ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-orange-200/50' 
                      : darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Professional Testimonials - Mobile Responsive */}
      <section className={`py-12 md:py-20 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 via-pink-900/20 to-gray-800/50' 
          : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text mb-4 md:mb-6">
              What Our Community Says
            </h2>
            <p className={`text-lg md:text-2xl max-w-4xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of satisfied professionals who have transformed their careers with HairCoaction
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl md:rounded-3xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {[
                  {
                    quote: "HairCoaction has completely transformed how I connect with my clients and stay updated with the latest techniques. The community is incredibly supportive and knowledgeable.",
                    name: "Dr. Sarah Wilson",
                    role: "Certified Trichologist",
                    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
                    rating: 5
                  },
                  {
                    quote: "The educational content is top-notch and the networking opportunities have helped me grow my practice significantly. I've learned more in 6 months than in years of traditional training.",
                    name: "Marcus Thompson",
                    role: "Hair Restoration Specialist",
                    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
                    rating: 5
                  },
                  {
                    quote: "As someone new to the hair care industry, HairCoaction provided me with the knowledge and confidence to succeed. The mentorship program is invaluable.",
                    name: "Emily Rodriguez",
                    role: "Hair Care Consultant",
                    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                    <div className={`rounded-2xl md:rounded-3xl border p-6 md:p-10 shadow-2xl text-center ${
                      darkMode 
                        ? 'bg-gray-800/90 backdrop-blur-2xl border-pink-700/30' 
                        : 'bg-white/90 backdrop-blur-2xl border-white/50'
                    }`}>
                      <div className="flex justify-center mb-4 md:mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 md:h-6 md:w-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className={`text-lg md:text-2xl italic mb-4 md:mb-8 leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center justify-center space-x-3 md:space-x-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-pink-200"
                        />
                        <div className="text-left">
                          <h4 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h4>
                          <p className="text-pink-400 font-medium text-sm md:text-base">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-600/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8">
            Ready to Transform Your Hair Journey?
          </h2>
          <p className="text-lg md:text-2xl text-pink-100 mb-8 md:mb-12 leading-relaxed">
            Join thousands of professionals who are already benefiting from HairCoaction. Start your free trial today and discover the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <button className="group px-6 md:px-10 py-3 md:py-5 bg-white text-pink-600 rounded-xl md:rounded-2xl text-lg md:text-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 md:px-10 py-3 md:py-5 border-2 md:border-3 border-white text-white rounded-xl md:rounded-2xl text-lg md:text-xl font-bold hover:bg-white/10 hover:scale-105 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Professional Contact Section - Mobile Responsive */}
      <section id="contact" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-rose-400 bg-clip-text mb-6 md:mb-8">
                Get in Touch
              </h2>
              <p className={`text-lg md:text-2xl mb-8 md:mb-12 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@haircoaction.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: MapPin, label: 'Address', value: '123 Hair Street, Beauty City, BC 12345' }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <contact.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-base md:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.label}</p>
                      <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-pink-600/10 to-rose-600/10' 
                  : 'bg-gradient-to-r from-pink-200/20 to-rose-200/20'
              }`}></div>
              <div className={`relative rounded-2xl md:rounded-3xl border p-6 md:p-10 shadow-2xl ${
                darkMode 
                  ? 'bg-gray-800/90 backdrop-blur-2xl border-pink-700/30' 
                  : 'bg-white/90 backdrop-blur-2xl border-white/50'
              }`}>
                <form className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className={`px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 focus:outline-none focus:border-pink-400 transition-all duration-300 text-base md:text-lg ${
                        darkMode 
                          ? 'border-pink-700/30 bg-gray-700/80 text-white placeholder-gray-400 focus:bg-gray-700' 
                          : 'border-pink-100 bg-white/80 focus:bg-white'
                      }`}
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className={`px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 focus:outline-none focus:border-pink-400 transition-all duration-300 text-base md:text-lg ${
                        darkMode 
                          ? 'border-pink-700/30 bg-gray-700/80 text-white placeholder-gray-400 focus:bg-gray-700' 
                          : 'border-pink-100 bg-white/80 focus:bg-white'
                      }`}
                      required 
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 focus:outline-none focus:border-pink-400 transition-all duration-300 text-base md:text-lg ${
                      darkMode 
                        ? 'border-pink-700/30 bg-gray-700/80 text-white placeholder-gray-400 focus:bg-gray-700' 
                        : 'border-pink-100 bg-white/80 focus:bg-white'
                    }`}
                    required 
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl border-2 focus:outline-none focus:border-pink-400 transition-all duration-300 text-base md:text-lg resize-none ${
                      darkMode 
                        ? 'border-pink-700/30 bg-gray-700/80 text-white placeholder-gray-400 focus:bg-gray-700' 
                        : 'border-pink-100 bg-white/80 focus:bg-white'
                    }`}
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 md:py-4 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500 text-white rounded-lg md:rounded-xl text-base md:text-lg font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer - Mobile Responsive */}
      <footer className="bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4 md:mb-6">
                HairCoaction
              </div>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                Empowering hair care professionals and enthusiasts through education, community, and innovation. Transform your hair journey with us.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                {[1, 2, 3].map((index) => (
                  <button key={index} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-full"></div>
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Demo', 'API', 'Updates']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Blog', 'Press', 'Partners']
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{section.title}</h3>
                <ul className="space-y-2 md:space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-base md:text-lg">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-0">
              © {new Date().getFullYear()} HairCoaction. All rights reserved.
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Custom Styles */}
      <style>{`
        @keyframes blob-3d {
          0% { transform: scale(1) translate(0,0) rotate(0deg); }
          33% { transform: scale(1.1) translate(30px,-40px) rotate(120deg); }
          66% { transform: scale(0.95) translate(-20px,20px) rotate(240deg); }
          100% { transform: scale(1) translate(0,0) rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-blob-3d {
          animation: blob-3d 12s ease-in-out infinite;
        }
        .animate-blob-3d-delay-2 {
          animation: blob-3d 12s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-blob-3d-delay-4 {
          animation: blob-3d 12s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delay-3 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .border-3 {
          border-width: 3px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for dark mode */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f1f5f9'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #f97316);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #db2777, #ea580c);
        }

        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .text-balance {
            text-wrap: balance;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;