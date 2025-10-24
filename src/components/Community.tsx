"use client"

import { useState } from "react"
import type { User } from "firebase/auth"
import { Heart, MessageCircle, Share2, User as UserIcon, Camera, Sparkles, Crown, Award } from "lucide-react"
import Sidebar from "./Sidebar";

interface Post {
  id: number
  author: {
    name: string
    avatar: string
    verified: boolean
    level: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  timeAgo: string
  tags: string[]
}

interface Member {
  id: number
  name: string
  avatar: string
  followers: string
  specialty: string
  verified: boolean
}

interface CommunityPageProps {
  user: User;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"feed" | "members" | "challenges">("feed")
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const posts: Post[] = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        level: "Hair Expert",
      },
      content:
        "Just tried the new curl defining cream and I'm obsessed! 😍 My curls have never looked more defined and bouncy. The formula is so lightweight yet moisturizing. Perfect for my 3B curls!",
      image: "/placeholder.svg?height=300&width=400",
      likes: 127,
      comments: 23,
      timeAgo: "2h ago",
      tags: ["CurlyHair", "ProductReview", "HairGoals"],
    },
    {
      id: 2,
      author: {
        name: "Maya Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
        level: "Hair Enthusiast",
      },
      content:
        "Weekly wash day routine complete! ✨ Used the deep conditioning mask and my hair feels like silk. The key is really taking your time with each step.",
      likes: 89,
      comments: 15,
      timeAgo: "4h ago",
      tags: ["WashDay", "DeepConditioning", "HairCare"],
    },
    {
      id: 3,
      author: {
        name: "Zoe Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        level: "Style Guru",
      },
      content:
        "Protective styling doesn't have to be boring! Here's my twist on box braids with some colorful accessories. Remember, healthy hair is beautiful hair! 💕",
      image: "/placeholder.svg?height=300&width=400",
      likes: 203,
      comments: 41,
      timeAgo: "6h ago",
      tags: ["ProtectiveStyles", "BoxBraids", "HairAccessories"],
    },
  ]

  const featuredMembers: Member[] = [
    {
      id: 1,
      name: "Dr. Amelia Foster",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "12.5K",
      specialty: "Trichologist",
      verified: true,
    },
    {
      id: 2,
      name: "Jasmine Lee",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "8.2K",
      specialty: "Natural Hair Coach",
      verified: true,
    },
    {
      id: 3,
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "15.7K",
      specialty: "Celebrity Stylist",
      verified: true,
    },
    {
      id: 4,
      name: "Isabella Rodriguez",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "9.8K",
      specialty: "Curly Hair Specialist",
      verified: true,
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "6.3K",
      specialty: "Color Expert",
      verified: false,
    },
    {
      id: 6,
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "11.2K",
      specialty: "Protective Styling",
      verified: true,
    },
    {
      id: 7,
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "4.7K",
      specialty: "Hair Growth Coach",
      verified: false,
    },
    {
      id: 8,
      name: "Maya Patel",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "13.5K",
      specialty: "Texture Specialist",
      verified: true,
    },
  ]

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-pink-200 flex">
      {/* Sidebar */}
      <Sidebar activeTab="community" setActiveTab={() => {}} user={user} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Community Header */}
        <div className="bg-gradient-to-r from-pink-500 via-orange-400 to-pink-500 text-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold">HairCare Community</h1>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-xl text-white/90 mb-6">
                Welcome to our vibrant community of hair enthusiasts, experts, and beauty lovers!
              </p>

              {/* Community Stats Bar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">24.5K</div>
                    <div className="text-sm text-white/80">Active Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-sm text-white/80">Posts Today</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-white/80">Hair Experts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1.2M</div>
                    <div className="text-sm text-white/80">Tips Shared</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-2xl p-6 border-2 border-pink-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Active Members</span>
                    <span className="font-bold text-pink-600">24.5K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Posts Today</span>
                    <span className="font-bold text-pink-600">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Hair Experts</span>
                    <span className="font-bold text-pink-600">89</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">#CurlyHairRoutine</span>
                    <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">2.3K posts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">#WashDayWednesday</span>
                    <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">1.8K posts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">#HairTransformation</span>
                    <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">1.5K posts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">#NaturalHairTips</span>
                    <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">1.2K posts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-800">#ProtectiveStyles</span>
                    <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">987 posts</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-200">
                    <p className="text-sm text-gray-800 font-medium mb-1">💡 Daily Tip</p>
                    <p className="text-xs text-gray-600">
                      Use a silk pillowcase to reduce friction and prevent hair breakage while you sleep.
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-200">
                    <p className="text-sm text-gray-800 font-medium mb-1">🌿 Natural Remedy</p>
                    <p className="text-xs text-gray-600">
                      Mix coconut oil with honey for a deep conditioning mask that adds shine and moisture.
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-200">
                    <p className="text-sm text-gray-800 font-medium mb-1">✂️ Styling Tip</p>
                    <p className="text-xs text-gray-600">
                      Always detangle wet hair with a wide-tooth comb, starting from the ends and working up.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Challenges</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg border-2 border-pink-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <p className="text-sm font-bold text-gray-800">This Week: Scalp Care</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Focus on scalp health with daily massages and gentle cleansing routines.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-600">847 participants</span>
                      <button className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full hover:bg-pink-600 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg border-2 border-pink-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      <p className="text-sm font-bold text-gray-800">Next Week: Moisture Lock</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Learn techniques to seal in moisture and prevent dryness.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-600">Starting Monday</span>
                      <button className="px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded-full">Coming Soon</button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg border-2 border-pink-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <p className="text-sm font-bold text-gray-800">Month End: Hair Detox</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Reset your hair with clarifying treatments and natural ingredient masks.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-600">Starts in 2 weeks</span>
                      <button className="px-3 py-1 bg-orange-300 text-orange-700 text-xs rounded-full">Notify Me</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Expert Q&A Session</p>
                      <p className="text-xs text-pink-600">Tomorrow, 7 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Hair Transformation Contest</p>
                      <p className="text-xs text-pink-600">Ends Friday</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Self-Care Sunday</p>
                      <p className="text-xs text-pink-600">This Sunday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Navigation Tabs */}
              <div className="bg-white shadow-md rounded-2xl p-2 border border-pink-200 mb-6">
                <div className="flex space-x-1">
                  {[
                    { key: "feed", label: "Community Feed", icon: MessageCircle },
                    { key: "members", label: "Members", icon: UserIcon },
                    { key: "challenges", label: "Challenges", icon: Award },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        activeTab === key
                          ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md"
                          : "text-pink-700 hover:bg-pink-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Post */}
              <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full border-2 border-pink-200"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Share your hair journey..."
                      className="w-full p-3 bg-pink-100 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    />
                  </div>
                  <button className="p-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Posts Feed */}
              {activeTab === "feed" && (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white shadow-md rounded-2xl border border-pink-200 overflow-hidden">
                      {/* Post Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author.avatar || "/placeholder.svg"}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full border-2 border-pink-200"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-800">{post.author.name}</h4>
                              {post.author.verified && <Crown className="w-4 h-4 text-yellow-500" />}
                              <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
                                {post.author.level}
                              </span>
                            </div>
                            <p className="text-sm text-pink-600">{post.timeAgo}</p>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-6 pb-4">
                        <p className="text-gray-800 mb-3 font-medium">{post.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-orange-200 text-orange-800 text-sm rounded-full font-medium border border-orange-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Post Image */}
                      {post.image && (
                        <div className="px-6 pb-4">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full rounded-xl border border-pink-200"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="px-6 py-4 bg-pink-50 border-t-2 border-pink-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center space-x-2 transition-colors ${
                                likedPosts.has(post.id) ? "text-pink-600" : "text-pink-600 hover:text-pink-600"
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                              <span className="text-sm font-medium">
                                {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                              </span>
                            </button>
                            <button className="flex items-center space-x-2 text-pink-600 hover:text-pink-600 transition-colors">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">{post.comments}</span>
                            </button>
                          </div>
                          <button className="text-pink-600 hover:text-pink-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Members Tab */}
              {activeTab === "members" && (
                <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Community Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredMembers.map((member) => (
                      <div key={member.id} className="p-4 bg-pink-100 border-2 border-pink-200 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-16 h-16 rounded-full border-2 border-pink-200"
                            />
                            {member.verified && <Crown className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{member.name}</h4>
                            <p className="text-pink-600">{member.specialty}</p>
                            <p className="text-sm text-pink-600">{member.followers} followers</p>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all rounded-lg">
                            Follow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges Tab */}
              {activeTab === "challenges" && (
                <div className="space-y-6">
                  <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-xl font-semibold text-gray-800">30-Day Healthy Hair Challenge</h3>
                    </div>
                    <p className="text-pink-600 mb-4">
                      Join thousands of members in our monthly hair health challenge! Follow our expert-designed routine
                      and share your progress.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-pink-600">2,847 participants</span>
                        <span className="text-sm text-pink-600">12 days left</span>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all">
                        Join Challenge
                      </button>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles className="w-6 h-6 text-pink-500" />
                      <h3 className="text-xl font-semibold text-gray-800">Curl Definition Week</h3>
                    </div>
                    <p className="text-pink-600 mb-4">
                      Perfect your curl routine with our week-long intensive program. Get personalized tips from our curl
                      specialists.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-pink-600">1,203 participants</span>
                        <span className="text-sm text-pink-600">Starting soon</span>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all">
                        Join Challenge
                      </button>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-2xl p-6 border border-pink-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Heart className="w-6 h-6 text-red-500" />
                      <h3 className="text-xl font-semibold text-gray-800">Hair Detox Challenge</h3>
                    </div>
                    <p className="text-pink-600 mb-4">
                      Reset your hair with clarifying treatments and natural ingredient masks. Remove buildup and restore
                      your hair's natural shine and health.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-pink-600">956 participants</span>
                        <span className="text-sm text-pink-600">Starts next month</span>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all">
                        Notify Me
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
