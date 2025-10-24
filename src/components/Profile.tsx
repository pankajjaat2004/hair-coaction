"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Camera,
  Edit3,
  Save,
  X,
  Check,
  Star,
  Users,
  BookOpen,
  Trophy,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Brain,
  Clock,
} from "lucide-react"
import Sidebar from "./Sidebar";
// import { auth } from "../../firebase";
// import { fetchUserProfile, updateUserProfile } from "../../api/profile";

import type { User as FirebaseUser } from "firebase/auth";

interface ProfileProps {
  user: FirebaseUser;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // User profile data state
  type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    dateOfBirth: string;
    bio: string;
    title: string;
    organization: string;
    specialization: string;
    experience: string;
    education: string;
    certifications: string[];
    profileImage: string;
    socialLinks: {
      linkedin: string;
      twitter: string;
      instagram: string;
      facebook: string;
      website: string;
    };
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    location: "",
    dateOfBirth: "",
    bio: "",
    title: "",
    organization: "",
    specialization: "",
    experience: "",
    education: "",
    certifications: [],
    profileImage: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      instagram: "",
      facebook: "",
      website: "",
    },
    showEmail: true,
    showPhone: true,
    showLocation: true,
  });

  // Stats data
  const [stats] = useState({
    workshopsAttended: 24,
    seminarsCompleted: 18,
    quizzesCompleted: 45,
    averageScore: 92,
    certificatesEarned: 8,
    hoursLearned: 156,
    rank: "Expert",
    joinedDate: "January 2023",
  })

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile from Firestore using API function
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const res = await fetch(`/api/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfileData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // handle error
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handlePrivacyToggle = (field: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }))
  }

  const addCertification = () => {
    setProfileData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }))
  }

  const updateCertification = (index: number, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? value : cert)),
    }))
  }

  const removeCertification = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!profileData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!profileData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = "Email is invalid"
    if (!profileData.title.trim()) newErrors.title = "Professional title is required"
    if (!profileData.organization.trim()) newErrors.organization = "Organization is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (user?.uid && user.email) {
        const res = await fetch(`/api/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...profileData, uid: String(user.uid), email: String(user.email) }),
        });
        if (!res.ok) throw new Error("Failed to save profile");
      }
      setIsLoading(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setIsLoading(false);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
    // Reset form data if needed
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    website: Globe,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100 flex">
      {/* Sidebar */}
  <Sidebar activeTab="profile" setActiveTab={() => {}} user={user} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center animate-slide-in-right">
              <Check className="h-5 w-5 mr-2" />
              Profile updated successfully!
            </div>
          )}

          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Manage your personal and professional information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div
              className={`lg:col-span-1 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-100 sticky top-8">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={profileData.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-200"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mt-4">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-pink-600 font-semibold">{profileData.title}</p>
                  <p className="text-gray-600">{profileData.organization}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-pink-600">{stats.workshopsAttended}</div>
                    <div className="text-xs text-gray-600">Workshops</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
                    <div className="text-xs text-gray-600">Avg Score</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{stats.certificatesEarned}</div>
                    <div className="text-xs text-gray-600">Certificates</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{stats.hoursLearned}h</div>
                    <div className="text-xs text-gray-600">Learning</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        ) : (
                          <Save className="h-5 w-5 mr-2" />
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-100 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <User className="h-6 w-6 mr-3 text-pink-500" />
                    Personal Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 ${errors.firstName ? "border-red-300" : "border-gray-200"}`}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.firstName}</div>
                    )}
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 ${errors.lastName ? "border-red-300" : "border-gray-200"}`}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.lastName}</div>
                    )}
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Email Address
                      {isEditing && (
                        <button
                          onClick={() => handlePrivacyToggle("showEmail")}
                          className="ml-2 text-gray-400 hover:text-pink-500"
                        >
                          {profileData.showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 ${errors.email ? "border-red-300" : "border-gray-200"}`}
                        placeholder="Enter email address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-pink-500" />
                        {profileData.showEmail ? profileData.email : "Hidden"}
                      </div>
                    )}
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Phone Number
                      {isEditing && (
                        <button
                          onClick={() => handlePrivacyToggle("showPhone")}
                          className="ml-2 text-gray-400 hover:text-pink-500"
                        >
                          {profileData.showPhone ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-pink-500" />
                        {profileData.showPhone ? profileData.phone : "Hidden"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Location
                      {isEditing && (
                        <button
                          onClick={() => handlePrivacyToggle("showLocation")}
                          className="ml-2 text-gray-400 hover:text-pink-500"
                        >
                          {profileData.showLocation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                        placeholder="Enter location"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                        {profileData.showLocation ? profileData.location : "Hidden"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                        {new Date(profileData.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 leading-relaxed">{profileData.bio}</div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-100 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Briefcase className="h-6 w-6 mr-3 text-pink-500" />
                    Professional Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 ${errors.title ? "border-red-300" : "border-gray-200"}`}
                        placeholder="Enter professional title"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.title}</div>
                    )}
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 ${errors.organization ? "border-red-300" : "border-gray-200"}`}
                        placeholder="Enter organization"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.organization}</div>
                    )}
                    {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                        placeholder="Enter specialization"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.specialization}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                        placeholder="Enter years of experience"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{profileData.experience}</div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                      placeholder="Enter education background"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-pink-500" />
                      {profileData.education}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">Certifications</label>
                    {isEditing && (
                      <button
                        onClick={addCertification}
                        className="text-pink-500 hover:text-pink-600 flex items-center text-sm font-medium"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={cert}
                              onChange={(e) => updateCertification(index, e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                              placeholder="Enter certification"
                            />
                            <button
                              onClick={() => removeCertification(index)}
                              className="text-red-500 hover:text-red-600 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-pink-500" />
                            {cert}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-100 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Globe className="h-6 w-6 mr-3 text-pink-500" />
                    Social Links
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(profileData.socialLinks).map(([platform, url]) => {
                    const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                    return (
                      <div key={platform}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize flex items-center">
                          <IconComponent className="h-4 w-4 mr-2 text-pink-500" />
                          {platform === "website" ? "Website" : platform}
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                            placeholder={`Enter ${platform} URL`}
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-700 break-all"
                              >
                                {url}
                              </a>
                            ) : (
                              <span className="text-gray-400">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Learning Statistics */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-100 transition-all duration-1000 ${animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "800ms" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Trophy className="h-6 w-6 mr-3 text-pink-500" />
                    Learning Statistics
                  </h3>
                  <div className="bg-gradient-to-r from-pink-100 to-orange-100 px-4 py-2 rounded-full">
                    <span className="text-pink-700 font-semibold text-sm">{stats.rank} Level</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl border border-pink-100">
                    <Users className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-pink-600 mb-1">{stats.workshopsAttended}</div>
                    <div className="text-gray-600 font-medium">Workshops Attended</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-purple-600 mb-1">{stats.seminarsCompleted}</div>
                    <div className="text-gray-600 font-medium">Seminars Completed</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                    <Brain className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-600 mb-1">{stats.quizzesCompleted}</div>
                    <div className="text-gray-600 font-medium">Quizzes Completed</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
                    <Star className="h-8 w-8 text-green-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-600 mb-1">{stats.averageScore}%</div>
                    <div className="text-gray-600 font-medium">Average Score</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                    <Award className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.certificatesEarned}</div>
                    <div className="text-gray-600 font-medium">Certificates Earned</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                    <Clock className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.hoursLearned}</div>
                    <div className="text-gray-600 font-medium">Hours of Learning</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl border border-pink-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Member since</p>
                      <p className="font-semibold text-gray-800">{stats.joinedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Current Rank</p>
                      <p className="font-semibold text-pink-600">{stats.rank}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Profile
