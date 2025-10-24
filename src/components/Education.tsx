"use client"

import type React from "react"
import { useState, type ReactNode, useLayoutEffect, useRef, useCallback } from "react"
import Sidebar from "./Sidebar"
import Lenis from "lenis"
import './Scrollstack.css';

import {
  BookOpen,
  Video,
  Award,
  BarChart3,
  Play,
  CheckCircle,
  Clock,
  Users,
  Brain,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Bookmark,
  ChevronRight,
  X,
  RotateCcw,
  Target,
} from "lucide-react"

// ScrollStack Components
export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = "" }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

interface ScrollStackProps {
  className?: string
  children: ReactNode
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  scaleDuration?: number
  rotationAmount?: number
  blurAmount?: number
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef(new Map<number, any>())
  const isUpdatingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (Number.parseFloat(value) / 100) * containerHeight
    }
    return Number.parseFloat(value as string)
  }, [])

  const updateCardTransforms = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller || !cardsRef.current.length || isUpdatingRef.current) return

    isUpdatingRef.current = true
    const scrollTop = scroller.scrollTop
    const containerHeight = scroller.clientHeight
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    const endElement = scroller.querySelector(".scroll-stack-end") as HTMLElement
    const endElementTop = endElement ? endElement.offsetTop : 0

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = card.offsetTop
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardsRef.current[j].offsetTop
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ""
        card.style.transform = transform
        card.style.filter = filter

        lastTransformsRef.current.set(i, newTransform)
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    calculateProgress,
    parsePercentage,
  ])

  const handleScroll = useCallback(() => {
    updateCardTransforms()
  }, [updateCardTransforms])

  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    })

    lenis.on("scroll", handleScroll)

    const raf = (time: number) => {
      lenis.raf(time)
      animationFrameRef.current = requestAnimationFrame(raf)
    }

    animationFrameRef.current = requestAnimationFrame(raf)
    lenisRef.current = lenis

    return lenis
  }, [handleScroll])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = Array.from(scroller.querySelectorAll(".scroll-stack-card")) as HTMLElement[]
    cardsRef.current = cards

    const transformsCache = lastTransformsRef.current
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      card.style.willChange = "transform, filter"
      card.style.transformOrigin = "top center"
      card.style.backfaceVisibility = "hidden"
      card.style.transform = "translateZ(0)"
      card.style.webkitTransform = "translateZ(0)"
      card.style.perspective = "1000px"
      card.style.webkitPerspective = "1000px"
    })

    setupLenis()
    updateCardTransforms()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      stackCompletedRef.current = false
      cardsRef.current = []
      transformsCache.clear()
      isUpdatingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    setupLenis,
    updateCardTransforms,
  ])

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}

// Interfaces
interface BlogPost {
  id: number
  title: string
  category: string
  readTime: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  tags: string[]
  image: string
}

interface VideoContent {
  id: number
  title: string
  expert: string
  duration: string
  topic: string
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  id: number
  title: string
  questions: number
  difficulty: string
  certified: boolean
  questionsData: QuizQuestion[]
}

import type { User as FirebaseUser } from "firebase/auth";

interface EducationProps {
  user: FirebaseUser;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Education: React.FC<EducationProps> = ({ user, darkMode, setDarkMode }) => {
  const [activeSection, setActiveSection] = useState<string>("blogs")
  const [activeTab, setActiveTab] = useState<string>("education")
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)
  const [quizScore, setQuizScore] = useState<number>(0)

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Understanding Common Hair Diseases and Their Prevention",
      category: "Hair Health",
      readTime: "8 min read",
      excerpt: "Learn about the most common hair diseases, their symptoms, and effective prevention strategies.",
      author: "Dr. Sarah Johnson",
      publishDate: "December 15, 2024",
      tags: ["Hair Health", "Prevention", "Dermatology"],
      image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>Introduction to Hair Diseases</h2>
        <p>Hair diseases affect millions of people worldwide, ranging from common conditions like dandruff to more serious disorders such as alopecia areata. Understanding these conditions is crucial for early detection and effective treatment.</p>
        
        <h3>Most Common Hair Diseases</h3>
        <h4>1. Androgenetic Alopecia (Male/Female Pattern Baldness)</h4>
        <p>This is the most common cause of hair loss, affecting up to 50% of people over the age of 50. It's characterized by a gradual thinning of hair, typically starting at the temples and crown in men, and diffuse thinning across the scalp in women.</p>
        
        <h4>2. Alopecia Areata</h4>
        <p>An autoimmune condition that causes patchy hair loss. The immune system mistakenly attacks hair follicles, leading to sudden hair loss in round or oval patches.</p>
        
        <h4>3. Telogen Effluvium</h4>
        <p>A temporary form of hair loss that occurs when a large number of hair follicles enter the resting phase simultaneously, often triggered by stress, illness, or hormonal changes.</p>
        
        <h4>4. Seborrheic Dermatitis</h4>
        <p>A common skin condition that affects the scalp, causing scaly, itchy rashes and dandruff. It can lead to hair loss if left untreated.</p>
        
        <h3>Prevention Strategies</h3>
        <ul>
          <li><strong>Maintain a healthy diet:</strong> Ensure adequate intake of proteins, vitamins, and minerals essential for hair health.</li>
          <li><strong>Gentle hair care:</strong> Avoid harsh chemicals, excessive heat styling, and tight hairstyles that can damage hair follicles.</li>
          <li><strong>Stress management:</strong> Practice stress-reduction techniques as chronic stress can contribute to hair loss.</li>
          <li><strong>Regular scalp care:</strong> Keep your scalp clean and moisturized to maintain a healthy environment for hair growth.</li>
          <li><strong>Early intervention:</strong> Seek professional help at the first signs of unusual hair loss or scalp problems.</li>
        </ul>
        
        <h3>When to See a Professional</h3>
        <p>Consult a dermatologist or trichologist if you experience:</p>
        <ul>
          <li>Sudden or patchy hair loss</li>
          <li>Excessive hair shedding (more than 100 hairs per day)</li>
          <li>Scalp irritation, redness, or scaling</li>
          <li>Changes in hair texture or growth patterns</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Understanding common hair diseases and their prevention is the first step toward maintaining healthy hair. Early detection and appropriate treatment can significantly improve outcomes and prevent further hair loss. Remember, what works for one person may not work for another, so it's important to consult with healthcare professionals for personalized advice.</p>
      `,
    },
    {
      id: 2,
      title: "Latest Research in Hair Loss Treatments",
      category: "Research",
      readTime: "12 min read",
      excerpt: "Discover cutting-edge treatments and breakthrough research in hair loss prevention and restoration.",
      author: "Dr. Michael Chen",
      publishDate: "December 10, 2024",
      tags: ["Research", "Treatments", "Innovation"],
      image: "https://images.pexels.com/photos/3845163/pexels-photo-3845163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>Revolutionary Advances in Hair Loss Treatment</h2>
        <p>The field of hair loss treatment has seen remarkable advances in recent years, with new therapies offering hope to millions suffering from various forms of alopecia. This comprehensive review explores the latest research and breakthrough treatments that are changing the landscape of hair restoration.</p>
        
        <h3>Stem Cell Therapy</h3>
        <p>One of the most promising developments in hair loss treatment is the use of stem cell therapy. Researchers have discovered that stem cells can be used to regenerate hair follicles and promote new hair growth.</p>
        
        <h4>Adipose-Derived Stem Cells (ADSCs)</h4>
        <p>Studies have shown that ADSCs can differentiate into various cell types, including those found in hair follicles. Clinical trials have demonstrated significant improvements in hair density and thickness when ADSCs are injected into the scalp.</p>
        
        <h4>Platelet-Rich Plasma (PRP) Enhanced with Stem Cells</h4>
        <p>Combining PRP with stem cell therapy has shown even more promising results, with patients experiencing faster and more robust hair regrowth compared to traditional PRP treatments alone.</p>
        
        <h3>Gene Therapy Approaches</h3>
        <p>Recent breakthroughs in gene therapy have opened new avenues for treating genetic forms of hair loss.</p>
        
        <h4>CRISPR-Cas9 Technology</h4>
        <p>Researchers are exploring the use of CRISPR gene editing to correct genetic mutations that cause hereditary hair loss conditions. Early studies in animal models have shown promising results.</p>
        
        <h4>Gene Expression Modulation</h4>
        <p>Scientists have identified key genes involved in hair follicle development and cycling. New treatments aim to modulate the expression of these genes to promote hair growth and prevent hair loss.</p>
        
        <h3>Novel Pharmaceutical Treatments</h3>
        <h4>JAK Inhibitors</h4>
        <p>Janus kinase (JAK) inhibitors have shown remarkable success in treating alopecia areata. The FDA has approved several JAK inhibitors for this condition, with clinical trials showing significant hair regrowth in many patients.</p>
        
        <h4>Prostaglandin Analogs</h4>
        <p>New prostaglandin analogs are being developed that can extend the growth phase of hair follicles and increase hair density. These treatments show promise for both male and female pattern baldness.</p>
        
        <h3>Advanced Hair Transplantation Techniques</h3>
        <h4>Robotic Hair Transplantation</h4>
        <p>AI-powered robotic systems now offer unprecedented precision in hair transplantation, reducing procedure time and improving graft survival rates.</p>
        
        <h4>Follicular Unit Extraction (FUE) Innovations</h4>
        <p>New FUE techniques, including the use of specialized punches and extraction tools, have improved the success rate of hair transplantation while minimizing scarring.</p>
        
        <h3>Regenerative Medicine</h3>
        <h4>Hair Follicle Cloning</h4>
        <p>Researchers are working on techniques to clone hair follicles in laboratory settings, potentially providing an unlimited source of follicles for transplantation.</p>
        
        <h4>Tissue Engineering</h4>
        <p>Scientists are developing bioengineered hair follicles using a combination of stem cells, growth factors, and scaffolding materials. These artificial follicles could revolutionize hair restoration treatments.</p>
        
        <h3>Personalized Medicine Approaches</h3>
        <p>The future of hair loss treatment lies in personalized medicine, where treatments are tailored to individual genetic profiles and specific causes of hair loss.</p>
        
        <h4>Genetic Testing</h4>
        <p>Advanced genetic testing can now identify specific genetic variants associated with hair loss, allowing for more targeted treatment approaches.</p>
        
        <h4>Biomarker Analysis</h4>
        <p>Researchers are developing panels of biomarkers that can predict treatment response and help clinicians choose the most effective therapy for each patient.</p>
        
        <h3>Future Directions</h3>
        <p>The field of hair loss treatment continues to evolve rapidly, with several exciting developments on the horizon:</p>
        <ul>
          <li>3D bioprinting of hair follicles</li>
          <li>Nanotechnology-based drug delivery systems</li>
          <li>Artificial intelligence for treatment optimization</li>
          <li>Combination therapies targeting multiple pathways</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>The latest research in hair loss treatments offers unprecedented hope for those suffering from various forms of alopecia. From stem cell therapy to gene editing, these breakthrough treatments are transforming the field and providing new options for patients who previously had limited choices. As research continues to advance, we can expect even more innovative and effective treatments to emerge in the coming years.</p>
      `,
    },
    {
      id: 3,
      title: "Essential Prevention Tips for Healthy Hair",
      category: "Prevention",
      readTime: "6 min read",
      excerpt: "Simple yet effective daily habits to maintain healthy hair and prevent common hair problems.",
      author: "Dr. Emily Rodriguez",
      publishDate: "December 8, 2024",
      tags: ["Prevention", "Hair Care", "Lifestyle"],
      image: "https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>Your Guide to Healthy Hair: Prevention is Better Than Cure</h2>
        <p>Maintaining healthy hair doesn't require expensive treatments or complicated routines. With the right knowledge and consistent care, you can prevent most common hair problems and keep your hair looking its best. Here are essential prevention tips that everyone should know.</p>
        
        <h3>Daily Hair Care Routine</h3>
        <h4>1. Gentle Cleansing</h4>
        <p>How you wash your hair can make a significant difference in its health:</p>
        <ul>
          <li>Use lukewarm water instead of hot water to prevent stripping natural oils</li>
          <li>Choose sulfate-free shampoos that are gentler on your hair and scalp</li>
          <li>Don't wash your hair daily unless you have very oily hair</li>
          <li>Focus shampoo on the scalp, not the hair lengths</li>
          <li>Always follow with a conditioner to maintain moisture balance</li>
        </ul>
        
        <h4>2. Proper Drying Techniques</h4>
        <p>How you dry your hair is crucial for preventing damage:</p>
        <ul>
          <li>Gently squeeze out excess water with a microfiber towel</li>
          <li>Avoid rubbing your hair vigorously with a regular towel</li>
          <li>Use a heat protectant before blow-drying</li>
          <li>Keep the blow dryer at least 6 inches away from your hair</li>
          <li>Use the cool setting to finish and seal the hair cuticles</li>
        </ul>
        
        <h3>Nutrition for Healthy Hair</h3>
        <p>Your hair reflects your overall health, and proper nutrition is fundamental:</p>
        
        <h4>Essential Nutrients</h4>
        <ul>
          <li><strong>Protein:</strong> Hair is primarily made of protein. Include lean meats, fish, eggs, legumes, and nuts in your diet</li>
          <li><strong>Iron:</strong> Iron deficiency is a common cause of hair loss. Good sources include spinach, red meat, and lentils</li>
          <li><strong>Vitamin D:</strong> Essential for hair follicle health. Get sunlight exposure and consider supplements if deficient</li>
          <li><strong>Biotin:</strong> Supports hair growth. Found in eggs, nuts, and sweet potatoes</li>
          <li><strong>Omega-3 fatty acids:</strong> Keep hair shiny and healthy. Found in fish, walnuts, and flaxseeds</li>
          <li><strong>Zinc:</strong> Deficiency can cause hair loss. Sources include oysters, pumpkin seeds, and chickpeas</li>
        </ul>
        
        <h4>Hydration</h4>
        <p>Drink plenty of water throughout the day. Dehydration can make hair dry and brittle.</p>
        
        <h3>Lifestyle Factors</h3>
        <h4>Stress Management</h4>
        <p>Chronic stress is a major contributor to hair loss. Implement stress-reduction techniques:</p>
        <ul>
          <li>Regular exercise</li>
          <li>Meditation or mindfulness practices</li>
          <li>Adequate sleep (7-9 hours per night)</li>
          <li>Hobbies and relaxation activities</li>
          <li>Social support and communication</li>
        </ul>
        
        <h4>Sleep Quality</h4>
        <p>Good sleep is essential for hair health:</p>
        <ul>
          <li>Use a silk or satin pillowcase to reduce friction</li>
          <li>Tie long hair loosely to prevent tangling</li>
          <li>Maintain a consistent sleep schedule</li>
          <li>Create a relaxing bedtime routine</li>
        </ul>
        
        <h3>Avoiding Damaging Practices</h3>
        <h4>Heat Styling</h4>
        <ul>
          <li>Limit the use of hot styling tools</li>
          <li>Always use heat protectant products</li>
          <li>Use the lowest effective temperature setting</li>
          <li>Give your hair heat-free days</li>
        </ul>
        
        <h4>Chemical Treatments</h4>
        <ul>
          <li>Space out chemical treatments (coloring, perming, relaxing)</li>
          <li>Choose professional services over at-home treatments</li>
          <li>Deep condition regularly if you use chemical treatments</li>
          <li>Consider gentler alternatives like semi-permanent colors</li>
        </ul>
        
        <h4>Tight Hairstyles</h4>
        <ul>
          <li>Avoid consistently tight ponytails, braids, or buns</li>
          <li>Vary your hairstyles to prevent constant tension on the same areas</li>
          <li>Use soft hair ties without metal clasps</li>
          <li>Give your hair breaks from tight styles</li>
        </ul>
        
        <h3>Environmental Protection</h3>
        <h4>Sun Protection</h4>
        <ul>
          <li>Wear a hat or use UV-protective hair products when outdoors</li>
          <li>Limit prolonged sun exposure</li>
          <li>Rinse hair after swimming in chlorinated pools</li>
        </ul>
        
        <h4>Pollution Protection</h4>
        <ul>
          <li>Cover your hair in heavily polluted areas</li>
          <li>Use clarifying shampoos occasionally to remove buildup</li>
          <li>Consider protective hairstyles in dusty environments</li>
        </ul>
        
        <h3>Regular Maintenance</h3>
        <h4>Trimming</h4>
        <ul>
          <li>Get regular trims every 6-8 weeks to prevent split ends</li>
          <li>Don't wait until damage is severe</li>
          <li>Use sharp, professional scissors for at-home trims</li>
        </ul>
        
        <h4>Scalp Care</h4>
        <ul>
          <li>Massage your scalp regularly to improve circulation</li>
          <li>Use a scalp scrub occasionally to remove buildup</li>
          <li>Keep your scalp clean but not over-cleansed</li>
          <li>Address scalp issues (dandruff, irritation) promptly</li>
        </ul>
        
        <h3>Warning Signs to Watch For</h3>
        <p>Be aware of these signs that may indicate hair problems:</p>
        <ul>
          <li>Excessive hair shedding (more than 100 hairs per day)</li>
          <li>Sudden changes in hair texture or appearance</li>
          <li>Scalp irritation, redness, or unusual odor</li>
          <li>Patchy hair loss</li>
          <li>Persistent dandruff or flaking</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Healthy hair starts with consistent, gentle care and a holistic approach to wellness. By following these prevention tips and making them part of your daily routine, you can maintain strong, beautiful hair and prevent many common hair problems. Remember, what works best can vary from person to person, so pay attention to how your hair responds to different practices and adjust accordingly.</p>
        
        <p>If you notice persistent problems despite following good hair care practices, don't hesitate to consult with a dermatologist or trichologist for professional advice.</p>
      `,
    },
    {
      id: 4,
      title: "Scalp Health: The Foundation of Beautiful Hair",
      category: "Scalp Care",
      readTime: "10 min read",
      excerpt: "Understanding the importance of scalp health and how it affects overall hair condition.",
      author: "Dr. James Wilson",
      publishDate: "December 5, 2024",
      tags: ["Scalp Care", "Hair Health", "Dermatology"],
      image: "https://images.pexels.com/photos/3993454/pexels-photo-3993454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>The Scalp: Your Hair's Foundation</h2>
        <p>When we think about hair care, we often focus on the visible strands while neglecting the scalp – the very foundation from which healthy hair grows. A healthy scalp is essential for strong, beautiful hair, yet it's often overlooked in our beauty routines. Understanding scalp health and how to maintain it is crucial for anyone seeking optimal hair health.</p>
        
        <h3>Understanding Scalp Anatomy</h3>
        <p>The scalp is a complex structure consisting of five layers:</p>
        <ol>
          <li><strong>Skin:</strong> The outermost layer containing hair follicles</li>
          <li><strong>Connective tissue:</strong> Contains blood vessels and nerves</li>
          <li><strong>Aponeurosis:</strong> A tough, fibrous layer</li>
          <li><strong>Loose connective tissue:</strong> Allows scalp mobility</li>
          <li><strong>Periosteum:</strong> The membrane covering the skull</li>
        </ol>
        
        <p>The scalp contains approximately 100,000 to 150,000 hair follicles, each with its own sebaceous gland that produces natural oils (sebum) to keep hair moisturized and protected.</p>
        
        <h3>Common Scalp Conditions</h3>
        <h4>1. Dandruff (Seborrheic Dermatitis)</h4>
        <p>Dandruff is one of the most common scalp conditions, characterized by flaking and sometimes itching. It's caused by:</p>
        <ul>
          <li>Overgrowth of Malassezia yeast</li>
          <li>Excessive oil production</li>
          <li>Sensitivity to hair care products</li>
          <li>Stress and hormonal changes</li>
        </ul>
        
        <h4>2. Scalp Psoriasis</h4>
        <p>An autoimmune condition causing thick, scaly patches on the scalp. Symptoms include:</p>
        <ul>
          <li>Thick, silvery scales</li>
          <li>Red, inflamed patches</li>
          <li>Itching and burning sensations</li>
          <li>Temporary hair loss in affected areas</li>
        </ul>
        
        <h4>3. Folliculitis</h4>
        <p>Inflammation of hair follicles, often caused by bacterial or fungal infections. Signs include:</p>
        <ul>
          <li>Small, red bumps around hair follicles</li>
          <li>Pus-filled lesions</li>
          <li>Tenderness and itching</li>
          <li>Temporary hair loss</li>
        </ul>
        
        <h4>4. Scalp Eczema</h4>
        <p>A form of dermatitis that causes:</p>
        <ul>
          <li>Red, inflamed patches</li>
          <li>Intense itching</li>
          <li>Dry, flaky skin</li>
          <li>Sometimes oozing or crusting</li>
        </ul>
        
        <h3>The Scalp-Hair Connection</h3>
        <p>The health of your scalp directly impacts your hair in several ways:</p>
        
        <h4>Blood Circulation</h4>
        <p>Good blood flow to the scalp ensures that hair follicles receive essential nutrients and oxygen needed for healthy hair growth. Poor circulation can lead to:</p>
        <ul>
          <li>Slower hair growth</li>
          <li>Weaker hair strands</li>
          <li>Premature hair loss</li>
        </ul>
        
        <h4>Sebum Production</h4>
        <p>The scalp's sebaceous glands produce natural oils that:</p>
        <ul>
          <li>Moisturize and protect hair strands</li>
          <li>Create a protective barrier against environmental damage</li>
          <li>Maintain the scalp's pH balance</li>
        </ul>
        
        <h4>Follicle Health</h4>
        <p>Healthy follicles are essential for:</p>
        <ul>
          <li>Strong hair growth</li>
          <li>Proper hair cycling</li>
          <li>Resistance to hair loss</li>
        </ul>
        
        <h3>Maintaining Scalp Health</h3>
        <h4>Proper Cleansing</h4>
        <p>Regular, gentle cleansing is fundamental to scalp health:</p>
        <ul>
          <li><strong>Frequency:</strong> Wash 2-3 times per week for normal scalps, daily for oily scalps</li>
          <li><strong>Technique:</strong> Massage gently with fingertips, not nails</li>
          <li><strong>Products:</strong> Choose pH-balanced, sulfate-free shampoos</li>
          <li><strong>Temperature:</strong> Use lukewarm water to avoid stripping natural oils</li>
        </ul>
        
        <h4>Scalp Massage</h4>
        <p>Regular scalp massage provides multiple benefits:</p>
        <ul>
          <li>Improves blood circulation</li>
          <li>Reduces stress and tension</li>
          <li>Helps distribute natural oils</li>
          <li>May stimulate hair growth</li>
        </ul>
        
        <p><strong>How to perform scalp massage:</strong></p>
        <ol>
          <li>Use your fingertips (not nails) to apply gentle pressure</li>
          <li>Start at the hairline and work toward the crown</li>
          <li>Use circular motions for 5-10 minutes</li>
          <li>Can be done with or without oils</li>
        </ol>
        
        <h4>Exfoliation</h4>
        <p>Gentle scalp exfoliation helps remove:</p>
        <ul>
          <li>Dead skin cells</li>
          <li>Product buildup</li>
          <li>Excess oil and debris</li>
        </ul>
        
        <p><strong>Exfoliation methods:</strong></p>
        <ul>
          <li>Scalp scrubs with gentle granules</li>
          <li>Chemical exfoliants (salicylic acid, glycolic acid)</li>
          <li>Clarifying shampoos</li>
          <li>DIY scrubs with sugar or salt</li>
        </ul>
        
        <h3>Nutrition for Scalp Health</h3>
        <p>A healthy scalp requires proper nutrition:</p>
        
        <h4>Essential Nutrients</h4>
        <ul>
          <li><strong>Omega-3 fatty acids:</strong> Reduce inflammation and support scalp health</li>
          <li><strong>Vitamin E:</strong> Antioxidant that protects scalp cells</li>
          <li><strong>Vitamin C:</strong> Supports collagen production and iron absorption</li>
          <li><strong>B vitamins:</strong> Essential for cell metabolism and hair growth</li>
          <li><strong>Zinc:</strong> Important for tissue repair and immune function</li>
          <li><strong>Selenium:</strong> Antioxidant that supports scalp health</li>
        </ul>
        
        <h3>Professional Scalp Treatments</h3>
        <h4>Scalp Analysis</h4>
        <p>Professional scalp analysis can identify:</p>
        <ul>
          <li>Scalp type and condition</li>
          <li>Hair follicle health</li>
          <li>Potential problems</li>
          <li>Appropriate treatment options</li>
        </ul>
        
        <h4>Medical Treatments</h4>
        <p>For serious scalp conditions, medical treatments may include:</p>
        <ul>
          <li>Prescription shampoos and topical treatments</li>
          <li>Oral medications for severe conditions</li>
          <li>Light therapy for certain conditions</li>
          <li>Steroid injections for inflammatory conditions</li>
        </ul>
        
        <h3>DIY Scalp Treatments</h3>
        <h4>Natural Remedies</h4>
        <ul>
          <li><strong>Tea tree oil:</strong> Antimicrobial properties for dandruff and irritation</li>
          <li><strong>Aloe vera:</strong> Soothing and moisturizing for irritated scalps</li>
          <li><strong>Apple cider vinegar:</strong> Helps balance pH and remove buildup</li>
          <li><strong>Coconut oil:</strong> Moisturizing and antimicrobial</li>
          <li><strong>Rosemary oil:</strong> May stimulate circulation and hair growth</li>
        </ul>
        
        <h4>Homemade Scalp Masks</h4>
        <p><strong>For dry scalp:</strong></p>
        <ul>
          <li>Avocado and honey mask</li>
          <li>Coconut oil and aloe vera treatment</li>
          <li>Oatmeal and yogurt mask</li>
        </ul>
        
        <p><strong>For oily scalp:</strong></p>
        <ul>
          <li>Clay and apple cider vinegar mask</li>
          <li>Lemon juice and tea tree oil treatment</li>
          <li>Green tea and mint mask</li>
        </ul>
        
        <h3>Lifestyle Factors Affecting Scalp Health</h3>
        <h4>Stress Management</h4>
        <p>Chronic stress can negatively impact scalp health by:</p>
        <ul>
          <li>Increasing oil production</li>
          <li>Triggering inflammatory conditions</li>
          <li>Disrupting the hair growth cycle</li>
          <li>Weakening the immune system</li>
        </ul>
        
        <h4>Sleep Quality</h4>
        <p>Good sleep supports scalp health through:</p>
        <ul>
          <li>Cellular repair and regeneration</li>
          <li>Hormone regulation</li>
          <li>Stress reduction</li>
          <li>Immune system support</li>
        </ul>
        
        <h4>Environmental Factors</h4>
        <p>Protect your scalp from:</p>
        <ul>
          <li>UV radiation with hats or UV-protective products</li>
          <li>Pollution by covering hair in heavily polluted areas</li>
          <li>Harsh weather conditions</li>
          <li>Chlorine and salt water</li>
        </ul>
        
        <h3>When to See a Professional</h3>
        <p>Consult a dermatologist or trichologist if you experience:</p>
        <ul>
          <li>Persistent itching, burning, or pain</li>
          <li>Unusual hair loss or thinning</li>
          <li>Severe dandruff that doesn't respond to over-the-counter treatments</li>
          <li>Red, inflamed patches that don't heal</li>
          <li>Signs of infection (pus, fever, swollen lymph nodes)</li>
          <li>Sudden changes in scalp condition</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>A healthy scalp is the foundation of beautiful, strong hair. By understanding your scalp's needs and implementing a consistent care routine, you can prevent many common scalp problems and create the optimal environment for healthy hair growth. Remember that scalp health is influenced by both external care and internal factors like nutrition, stress, and overall health.</p>
        
        <p>Investing time and attention in scalp care will pay dividends in the form of healthier, more beautiful hair. Start with gentle, consistent care, and don't hesitate to seek professional help when needed. Your scalp – and your hair – will thank you for it.</p>
      `,
    },
    {
      id: 5,
      title: "Hair Transplant: Modern Techniques and What to Expect",
      category: "Treatments",
      readTime: "14 min read",
      excerpt: "A comprehensive guide to hair transplant procedures, techniques, and recovery expectations.",
      author: "Dr. Robert Martinez",
      publishDate: "December 12, 2024",
      tags: ["Hair Transplant", "Surgery", "Restoration"],
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>Hair Transplant: A Modern Solution to Hair Loss</h2>
        <p>Hair transplantation has evolved significantly over the past decades, becoming one of the most effective permanent solutions for hair loss. This comprehensive guide covers everything you need to know about modern hair transplant techniques, the procedure itself, and what to expect during recovery.</p>
        
        <h3>Understanding Hair Transplantation</h3>
        <p>Hair transplantation is a surgical procedure that moves hair follicles from a donor area (usually the back and sides of the head) to areas experiencing hair loss or thinning. The transplanted hair maintains its genetic resistance to hair loss, providing a permanent solution.</p>
        
        <h3>Modern Hair Transplant Techniques</h3>
        <h4>1. Follicular Unit Extraction (FUE)</h4>
        <p>FUE is currently the most popular hair transplant technique, offering several advantages:</p>
        <ul>
          <li><strong>Minimal scarring:</strong> Individual follicles are extracted, leaving tiny circular scars that are virtually undetectable</li>
          <li><strong>Faster recovery:</strong> Less invasive procedure with quicker healing time</li>
          <li><strong>Natural results:</strong> Allows for precise placement of individual follicular units</li>
          <li><strong>No linear scar:</strong> Patients can wear their hair short without visible scarring</li>
        </ul>
        
        <h4>2. Follicular Unit Transplantation (FUT)</h4>
        <p>Also known as the strip method, FUT involves:</p>
        <ul>
          <li>Removing a strip of scalp from the donor area</li>
          <li>Dissecting the strip into individual follicular units</li>
          <li>Transplanting these units to the recipient area</li>
          <li>Higher graft yield in a single session</li>
          <li>More cost-effective for large areas</li>
        </ul>
        
        <h4>3. Robotic Hair Transplantation (ARTAS)</h4>
        <p>Advanced robotic systems offer:</p>
        <ul>
          <li>AI-powered precision in graft selection and extraction</li>
          <li>Consistent results with minimal human error</li>
          <li>Faster procedure times</li>
          <li>Improved graft survival rates</li>
        </ul>
        
        <h4>4. Direct Hair Implantation (DHI)</h4>
        <p>A refined FUE technique featuring:</p>
        <ul>
          <li>Immediate implantation using a specialized pen-like device</li>
          <li>No need to create recipient sites beforehand</li>
          <li>Better control over angle, depth, and direction</li>
          <li>Higher survival rate of transplanted follicles</li>
        </ul>
        
        <h3>Candidacy for Hair Transplant</h3>
        <h4>Good Candidates Include:</h4>
        <ul>
          <li>Men with male pattern baldness (Norwood scale 3-6)</li>
          <li>Women with female pattern hair loss (Ludwig scale 1-2)</li>
          <li>Individuals with sufficient donor hair</li>
          <li>People with realistic expectations</li>
          <li>Those with stable hair loss patterns</li>
          <li>Patients over 25 years of age (in most cases)</li>
        </ul>
        
        <h4>Poor Candidates Include:</h4>
        <ul>
          <li>Individuals with insufficient donor hair</li>
          <li>People with unrealistic expectations</li>
          <li>Those with certain medical conditions affecting healing</li>
          <li>Patients with diffuse unpatterned alopecia</li>
          <li>Individuals with active scalp infections</li>
        </ul>
        
        <h3>The Hair Transplant Process</h3>
        <h4>Pre-Procedure Consultation</h4>
        <p>A thorough consultation includes:</p>
        <ul>
          <li>Medical history review</li>
          <li>Scalp examination and analysis</li>
          <li>Donor area assessment</li>
          <li>Treatment plan development</li>
          <li>Cost estimation</li>
          <li>Setting realistic expectations</li>
        </ul>
        
        <h4>Day of Surgery</h4>
        <p>The procedure typically involves:</p>
        <ol>
          <li><strong>Preparation:</strong> Cleaning and marking the scalp areas</li>
          <li><strong>Local anesthesia:</strong> Numbing both donor and recipient areas</li>
          <li><strong>Extraction:</strong> Harvesting follicular units from the donor area</li>
          <li><strong>Preparation of grafts:</strong> Sorting and preparing follicles under microscope</li>
          <li><strong>Recipient site creation:</strong> Making tiny incisions in the recipient area</li>
          <li><strong>Implantation:</strong> Carefully placing each graft in the recipient sites</li>
        </ol>
        
        <h3>Recovery and Aftercare</h3>
        <h4>Immediate Post-Procedure (Days 1-7)</h4>
        <ul>
          <li><strong>Rest:</strong> Avoid strenuous activities for the first few days</li>
          <li><strong>Sleep position:</strong> Sleep with head elevated to reduce swelling</li>
          <li><strong>Gentle care:</strong> Avoid touching or washing the scalp for 24-48 hours</li>
          <li><strong>Medication:</strong> Take prescribed antibiotics and pain medications</li>
          <li><strong>Follow-up:</strong> Attend post-operative appointments</li>
        </ul>
        
        <h4>Early Recovery (Weeks 1-4)</h4>
        <ul>
          <li><strong>Gentle washing:</strong> Start gentle shampooing as directed</li>
          <li><strong>Avoid sun exposure:</strong> Protect scalp from UV rays</li>
          <li><strong>No heavy lifting:</strong> Avoid activities that increase blood pressure</li>
          <li><strong>Scab removal:</strong> Allow scabs to fall off naturally</li>
          <li><strong>Return to work:</strong> Most patients can return to work within 3-7 days</li>
        </ul>
        
        <h4>Long-term Recovery (Months 1-12)</h4>
        <ul>
          <li><strong>Shock loss:</strong> Temporary shedding of transplanted hair (normal)</li>
          <li><strong>New growth:</strong> Hair starts growing around 3-4 months</li>
          <li><strong>Gradual improvement:</strong> Continued improvement for 12-18 months</li>
          <li><strong>Final results:</strong> Mature results visible after 12-18 months</li>
        </ul>
        
        <h3>Expected Results and Timeline</h3>
        <h4>Month 1-2: Initial Healing</h4>
        <ul>
          <li>Transplanted hair may shed (shock loss)</li>
          <li>Scalp healing and scab formation</li>
          <li>Some swelling and redness</li>
        </ul>
        
        <h4>Month 3-4: Early Growth</h4>
        <ul>
          <li>New hair growth begins</li>
          <li>Hair appears thin and fine initially</li>
          <li>Gradual improvement in appearance</li>
        </ul>
        
        <h4>Month 6-8: Visible Improvement</h4>
        <ul>
          <li>Significant hair growth becomes visible</li>
          <li>Hair starts to thicken and mature</li>
          <li>Natural appearance begins to emerge</li>
        </ul>
        
        <h4>Month 12-18: Final Results</h4>
        <ul>
          <li>Mature, fully developed hair growth</li>
          <li>Natural appearance and density</li>
          <li>Hair can be styled normally</li>
        </ul>
        
        <h3>Potential Risks and Complications</h3>
        <h4>Common Side Effects (Usually Temporary)</h4>
        <ul>
          <li>Swelling around eyes and forehead</li>
          <li>Mild pain or discomfort</li>
          <li>Temporary numbness</li>
          <li>Scabbing and crusting</li>
          <li>Shock loss of existing hair</li>
        </ul>
        
        <h4>Rare Complications</h4>
        <ul>
          <li>Infection (less than 1% of cases)</li>
          <li>Excessive bleeding</li>
          <li>Poor wound healing</li>
          <li>Unnatural appearance</li>
          <li>Permanent nerve damage (extremely rare)</li>
        </ul>
        
        <h3>Factors Affecting Success</h3>
        <h4>Patient Factors</h4>
        <ul>
          <li>Age and extent of hair loss</li>
          <li>Quality and quantity of donor hair</li>
          <li>Scalp laxity and characteristics</li>
          <li>Overall health and healing ability</li>
          <li>Realistic expectations</li>
        </ul>
        
        <h4>Surgical Factors</h4>
        <ul>
          <li>Surgeon's experience and skill</li>
          <li>Technique used</li>
          <li>Graft handling and preparation</li>
          <li>Artistic design and planning</li>
          <li>Post-operative care quality</li>
        </ul>
        
        <h3>Cost Considerations</h3>
        <p>Hair transplant costs vary based on:</p>
        <ul>
          <li>Geographic location</li>
          <li>Surgeon's reputation and experience</li>
          <li>Technique used (FUE typically costs more than FUT)</li>
          <li>Number of grafts needed</li>
          <li>Clinic facilities and technology</li>
          <li>Additional services and follow-up care</li>
        </ul>
        
        <h3>Choosing the Right Surgeon</h3>
        <h4>Important Qualifications</h4>
        <ul>
          <li>Board certification in dermatology or plastic surgery</li>
          <li>Specialized training in hair restoration</li>
          <li>Membership in professional organizations (ISHRS)</li>
          <li>Extensive experience with desired technique</li>
          <li>Good reputation and patient reviews</li>
        </ul>
        
        <h4>Questions to Ask</h4>
        <ul>
          <li>How many procedures have you performed?</li>
          <li>Can I see before and after photos of similar cases?</li>
          <li>What technique do you recommend for my case?</li>
          <li>What are the potential risks and complications?</li>
          <li>What is included in the quoted price?</li>
          <li>What is your revision policy?</li>
        </ul>
        
        <h3>Alternative and Complementary Treatments</h3>
        <p>Hair transplant can be combined with:</p>
        <ul>
          <li>PRP (Platelet-Rich Plasma) therapy</li>
          <li>Medications (finasteride, minoxidil)</li>
          <li>Low-level laser therapy</li>
          <li>Scalp micropigmentation</li>
          <li>Hair systems or wigs (temporary solutions)</li>
        </ul>
        
        <h3>Future of Hair Transplantation</h3>
        <p>Emerging technologies and techniques include:</p>
        <ul>
          <li>Hair follicle cloning and multiplication</li>
          <li>Stem cell therapy integration</li>
          <li>Advanced robotic systems</li>
          <li>Bioengineered hair follicles</li>
          <li>Gene therapy approaches</li>
          <li>3D printing of hair follicles</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Hair transplantation has become a highly refined and effective treatment for hair loss, offering natural-looking, permanent results when performed by experienced surgeons. The key to success lies in proper candidate selection, realistic expectations, choosing the right technique and surgeon, and following post-operative care instructions.</p>
        
        <p>While the procedure requires a significant investment of time and money, the psychological benefits and improved quality of life often make it worthwhile for suitable candidates. As technology continues to advance, hair transplantation will likely become even more effective and accessible in the future.</p>
        
        <p>If you're considering hair transplantation, take time to research thoroughly, consult with multiple qualified surgeons, and make an informed decision based on your individual needs and circumstances.</p>
      `,
    },
    {
      id: 6,
      title: "Hormonal Hair Loss in Women: Understanding and Managing the Challenge",
      category: "Women's Health",
      readTime: "11 min read",
      excerpt: "Exploring the complex relationship between hormones and hair loss in women, with practical management strategies.",
      author: "Dr. Lisa Thompson",
      publishDate: "December 3, 2024",
      tags: ["Women's Health", "Hormones", "Hair Loss"],
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>Hormonal Hair Loss in Women: A Complex Challenge</h2>
        <p>Hair loss in women is often more emotionally distressing than in men, yet it's frequently misunderstood and undertreated. Hormonal factors play a crucial role in female hair loss, making it a complex condition that requires specialized understanding and care. This comprehensive guide explores the intricate relationship between hormones and hair health in women.</p>
        
        <h3>Understanding Female Hair Loss</h3>
        <p>Unlike male pattern baldness, which typically follows predictable patterns, female hair loss can be more subtle and diffuse. Women rarely experience complete baldness but instead may notice:</p>
        <ul>
          <li>Gradual thinning across the entire scalp</li>
          <li>Widening of the central part</li>
          <li>Reduced hair volume and density</li>
          <li>Increased hair shedding during washing or brushing</li>
          <li>Visible scalp through the hair</li>
        </ul>
        
        <h3>The Role of Hormones in Hair Health</h3>
        <h4>Estrogen: The Hair-Friendly Hormone</h4>
        <p>Estrogen is generally protective for hair health:</p>
        <ul>
          <li><strong>Extends growth phase:</strong> Prolongs the anagen (growth) phase of hair follicles</li>
          <li><strong>Improves hair quality:</strong> Enhances hair thickness, shine, and overall health</li>
          <li><strong>Reduces DHT effects:</strong> Helps counteract the hair-damaging effects of DHT</li>
          <li><strong>Supports scalp health:</strong> Maintains healthy scalp circulation and follicle function</li>
        </ul>
        
        <h4>Androgens: The Double-Edged Sword</h4>
        <p>Androgens, including testosterone and DHT, can negatively impact hair growth:</p>
        <ul>
          <li><strong>DHT sensitivity:</strong> Hair follicles sensitive to DHT gradually shrink and produce thinner hair</li>
          <li><strong>Shortened growth cycles:</strong> Reduces the duration of the hair growth phase</li>
          <li><strong>Follicle miniaturization:</strong> Causes progressive shrinking of hair follicles</li>
          <li><strong>Increased shedding:</strong> Can trigger excessive hair loss</li>
        </ul>
        
        <h4>Progesterone: The Balancing Act</h4>
        <p>Progesterone has complex effects on hair:</p>
        <ul>
          <li><strong>Anti-androgenic properties:</strong> Can help counteract androgen effects</li>
          <li><strong>Sebum regulation:</strong> Helps control oil production in the scalp</li>
          <li><strong>Stress reduction:</strong> May help reduce stress-related hair loss</li>
          <li><strong>Sleep quality:</strong> Improves sleep, which is important for hair health</li>
        </ul>
        
        <h3>Common Causes of Hormonal Hair Loss in Women</h3>
        <h4>1. Androgenetic Alopecia (Female Pattern Hair Loss)</h4>
        <p>The most common form of hair loss in women, affecting up to 50% of women over 50:</p>
        <ul>
          <li><strong>Genetic predisposition:</strong> Inherited sensitivity to DHT</li>
          <li><strong>Age-related:</strong> Often becomes noticeable after menopause</li>
          <li><strong>Pattern:</strong> Diffuse thinning, particularly at the crown</li>
          <li><strong>Progression:</strong> Gradual worsening over time without treatment</li>
        </ul>
        
        <h4>2. Menopause-Related Hair Loss</h4>
        <p>The hormonal changes during menopause significantly impact hair:</p>
        <ul>
          <li><strong>Estrogen decline:</strong> Reduced estrogen levels lose their protective effects</li>
          <li><strong>Relative androgen increase:</strong> As estrogen drops, androgen effects become more pronounced</li>
          <li><strong>Multiple symptoms:</strong> Often accompanied by hot flashes, mood changes, and other menopausal symptoms</li>
          <li><strong>Timeline:</strong> Can begin during perimenopause and continue post-menopause</li>
        </ul>
        
        <h4>3. Pregnancy and Postpartum Hair Changes</h4>
        <p>Pregnancy brings dramatic hormonal changes affecting hair:</p>
        
        <p><strong>During Pregnancy:</strong></p>
        <ul>
          <li>Increased estrogen and progesterone levels</li>
          <li>Extended hair growth phase</li>
          <li>Thicker, fuller hair appearance</li>
          <li>Reduced hair shedding</li>
        </ul>
        
        <p><strong>Postpartum Period:</strong></p>
        <ul>
          <li>Rapid hormonal decline after delivery</li>
          <li>Telogen effluvium (excessive shedding)</li>
          <li>Temporary but can be distressing</li>
          <li>Usually resolves within 6-12 months</li>
        </ul>
        
        <h4>4. Polycystic Ovary Syndrome (PCOS)</h4>
        <p>PCOS affects 5-10% of women of reproductive age and can cause significant hair changes:</p>
        <ul>
          <li><strong>Elevated androgens:</strong> High levels of testosterone and other androgens</li>
          <li><strong>Insulin resistance:</strong> Can worsen androgen production</li>
          <li><strong>Hair loss pattern:</strong> Often resembles male pattern baldness</li>
          <li><strong>Associated symptoms:</strong> Irregular periods, weight gain, acne, hirsutism</li>
        </ul>
        
        <h4>5. Thyroid Disorders</h4>
        <p>Both hyperthyroidism and hypothyroidism can cause hair loss:</p>
        
        <p><strong>Hypothyroidism:</strong></p>
        <ul>
          <li>Hair becomes thin, brittle, and dry</li>
          <li>Diffuse hair loss across the scalp</li>
          <li>Slower hair growth</li>
          <li>Loss of outer third of eyebrows</li>
        </ul>
        
        <p><strong>Hyperthyroidism:</strong></p>
        <ul>
          <li>Hair becomes fine and soft</li>
          <li>Diffuse thinning</li>
          <li>Rapid hair loss</li>
          <li>Hair may be more fragile</li>
        </ul>
        
        <h3>Diagnostic Approach</h3>
        <h4>Medical History</h4>
        <p>A comprehensive history should include:</p>
        <ul>
          <li>Timeline of hair loss onset</li>
          <li>Menstrual history and pregnancies</li>
          <li>Medications and supplements</li>
          <li>Family history of hair loss</li>
          <li>Stress levels and recent life changes</li>
          <li>Diet and nutrition habits</li>
        </ul>
        
        <h4>Physical Examination</h4>
        <ul>
          <li>Scalp examination for inflammation or scarring</li>
          <li>Hair pull test to assess shedding</li>
          <li>Assessment of hair loss pattern</li>
          <li>Check for signs of other hormonal conditions</li>
        </ul>
        
        <h4>Laboratory Tests</h4>
        <p>Common tests may include:</p>
        <ul>
          <li><strong>Hormone levels:</strong> Testosterone, DHEA-S, androstenedione</li>
          <li><strong>Thyroid function:</strong> TSH, T3, T4</li>
          <li><strong>Iron studies:</strong> Ferritin, iron, TIBC</li>
          <li><strong>Vitamin levels:</strong> B12, vitamin D</li>
          <li><strong>Complete blood count:</strong> To rule out anemia</li>
          <li><strong>Inflammatory markers:</strong> If autoimmune conditions are suspected</li>
        </ul>
        
        <h3>Treatment Options</h3>
        <h4>Topical Treatments</h4>
        <p><strong>Minoxidil (Rogaine):</strong></p>
        <ul>
          <li>FDA-approved for female pattern hair loss</li>
          <li>Available in 2% and 5% concentrations</li>
          <li>Stimulates hair follicles and increases blood flow</li>
          <li>Requires consistent daily use</li>
          <li>Results visible after 3-6 months</li>
        </ul>
        
        <h4>Oral Medications</h4>
        <p><strong>Spironolactone:</strong></p>
        <ul>
          <li>Anti-androgen medication</li>
          <li>Blocks DHT effects on hair follicles</li>
          <li>Particularly effective for PCOS-related hair loss</li>
          <li>Requires monitoring of electrolytes</li>
          <li>Not suitable during pregnancy</li>
        </ul>
        
        <p><strong>Finasteride:</strong></p>
        <ul>
          <li>5α-reductase inhibitor</li>
          <li>Reduces DHT production</li>
          <li>Off-label use in women (post-menopausal)</li>
          <li>Contraindicated in women of childbearing age</li>
          <li>Requires careful monitoring</li>
        </ul>
        
        <h4>Hormone Replacement Therapy (HRT)</h4>
        <p>For menopausal women, HRT may help with hair loss:</p>
        <ul>
          <li><strong>Estrogen replacement:</strong> Can help maintain hair quality</li>
          <li><strong>Bioidentical hormones:</strong> May have fewer side effects</li>
          <li><strong>Individualized approach:</strong> Requires careful risk-benefit analysis</li>
          <li><strong>Professional guidance:</strong> Should be managed by experienced healthcare providers</li>
        </ul>
        
        <h4>Natural and Nutritional Approaches</h4>
        <p><strong>Dietary Supplements:</strong></p>
        <ul>
          <li><strong>Iron:</strong> If deficient, supplementation can improve hair growth</li>
          <li><strong>Biotin:</strong> May help with hair strength and growth</li>
          <li><strong>Vitamin D:</strong> Essential for hair follicle health</li>
          <li><strong>Omega-3 fatty acids:</strong> Anti-inflammatory and supportive of hair health</li>
          <li><strong>Zinc:</strong> Important for hair growth and repair</li>
        </ul>
        
        <p><strong>Herbal Remedies:</strong></p>
        <ul>
          <li><strong>Saw palmetto:</strong> Natural DHT blocker</li>
          <li><strong>Pumpkin seed oil:</strong> May inhibit 5α-reductase</li>
          <li><strong>Spearmint tea:</strong> Anti-androgenic properties</li>
          <li><strong>Green tea extract:</strong> Antioxidant and anti-inflammatory</li>
        </ul>
        
        <h3>Advanced Treatment Options</h3>
        <h4>Platelet-Rich Plasma (PRP)</h4>
        <ul>
          <li>Uses patient's own blood platelets</li>
          <li>Stimulates hair follicles and promotes growth</li>
          <li>Minimally invasive procedure</li>
          <li>Multiple sessions required</li>
          <li>Good safety profile</li>
        </ul>
        
        <h4>Low-Level Laser Therapy (LLLT)</h4>
        <ul>
          <li>FDA-cleared for female pattern hair loss</li>
          <li>Stimulates cellular activity in hair follicles</li>
          <li>Can be done at home with devices</li>
          <li>Requires consistent use for results</li>
          <li>Good adjunct to other treatments</li>
        </ul>
        
        <h4>Hair Transplantation</h4>
        <ul>
          <li>Less commonly performed in women</li>
          <li>Requires adequate donor hair</li>
          <li>Best for women with stable, localized loss</li>
          <li>Modern techniques provide natural results</li>
          <li>Permanent solution when appropriate</li>
        </ul>
        
        <h3>Lifestyle Management</h3>
        <h4>Stress Management</h4>
        <ul>
          <li>Chronic stress can worsen hormonal imbalances</li>
          <li>Practice relaxation techniques</li>
          <li>Regular exercise (but not excessive)</li>
          <li>Adequate sleep is crucial</li>
          <li>Consider counseling or therapy</li>
        </ul>
        
        <h4>Nutrition and Diet</h4>
        <ul>
          <li>Balanced diet rich in proteins</li>
          <li>Include healthy fats (omega-3s)</li>
          <li>Limit processed foods and sugar</li>
          <li>Stay hydrated</li>
          <li>Consider anti-inflammatory foods</li>
        </ul>
        
        <h4>Hair Care Practices</h4>
        <ul>
          <li>Use gentle, sulfate-free shampoos</li>
          <li>Avoid harsh chemical treatments</li>
          <li>Minimize heat styling</li>
          <li>Be gentle when brushing wet hair</li>
          <li>Consider protective hairstyles</li>
        </ul>
        
        <h3>Psychological Impact and Support</h3>
        <p>Hair loss can have significant psychological effects on women:</p>
        <ul>
          <li><strong>Self-esteem issues:</strong> Many women tie their identity to their hair</li>
          <li><strong>Social anxiety:</strong> May avoid social situations</li>
          <li><strong>Depression:</strong> Can lead to mood disorders</li>
          <li><strong>Relationship impact:</strong> May affect intimate relationships</li>
        </ul>
        
        <p><strong>Coping strategies:</strong></p>
        <ul>
          <li>Seek support from family and friends</li>
          <li>Join support groups (online or in-person)</li>
          <li>Consider professional counseling</li>
          <li>Explore styling options and accessories</li>
          <li>Focus on overall health and wellbeing</li>
        </ul>
        
        <h3>Prevention Strategies</h3>
        <ul>
          <li>Maintain hormonal balance through healthy lifestyle</li>
          <li>Address underlying health conditions promptly</li>
          <li>Avoid crash diets and extreme weight loss</li>
          <li>Protect hair from environmental damage</li>
          <li>Regular health check-ups and screenings</li>
          <li>Early intervention when hair changes are noticed</li>
        </ul>
        
        <h3>Future Directions</h3>
        <p>Research in female hair loss continues to evolve:</p>
        <ul>
          <li>Better understanding of female-specific patterns</li>
          <li>Development of new anti-androgen treatments</li>
          <li>Personalized medicine approaches</li>
          <li>Stem cell and regenerative therapies</li>
          <li>Improved diagnostic tools</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Hormonal hair loss in women is a complex condition that requires a comprehensive, individualized approach. Understanding the intricate relationship between hormones and hair health is crucial for effective treatment. While the condition can be emotionally challenging, numerous treatment options are available, and ongoing research continues to provide new hope.</p>
        
        <p>The key to successful management lies in early recognition, proper diagnosis, and a multi-faceted treatment approach that addresses both the physical and emotional aspects of hair loss. Women experiencing hair loss should not hesitate to seek professional help, as effective treatments are available and can significantly improve both hair health and quality of life.</p>
        
        <p>Remember that hair loss treatment is often a long-term commitment, and patience is essential as most treatments take several months to show results. With proper care and treatment, many women can successfully manage their hair loss and maintain healthy, beautiful hair throughout their lives.</p>
      `,
    },
    {
      id: 7,
      title: "The Science of Hair Growth: Understanding Your Hair Cycle",
      category: "Hair Science",
      readTime: "9 min read",
      excerpt: "Deep dive into the biological processes that govern hair growth and how to optimize them.",
      author: "Dr. Alexandra Kim",
      publishDate: "November 28, 2024",
      tags: ["Hair Science", "Biology", "Growth Cycle"],
      image: "https://images.pexels.com/photos/3771605/pexels-photo-3771605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <h2>The Fascinating Science Behind Hair Growth</h2>
        <p>Hair growth is one of the most remarkable biological processes in the human body, involving complex cellular mechanisms that have evolved over millions of years. Understanding the science behind hair growth not only satisfies curiosity but also provides crucial insights for maintaining healthy hair and addressing hair loss effectively.</p>
        
        <h3>The Hair Follicle: Nature's Engineering Marvel</h3>
        <p>The hair follicle is a sophisticated biological structure that serves as the foundation for hair growth. Each follicle is essentially a mini-organ with its own blood supply, nerve endings, and sebaceous glands.</p>
        
        <h4>Anatomy of a Hair Follicle</h4>
        <ul>
          <li><strong>Hair shaft:</strong> The visible part of the hair extending above the skin surface</li>
          <li><strong>Hair root:</strong> The portion of hair below the skin surface</li>
          <li><strong>Hair bulb:</strong> The enlarged base of the root containing the hair matrix</li>
          <li><strong>Dermal papilla:</strong> The cluster of cells that control hair growth</li>
          <li><strong>Hair matrix:</strong> The region where new hair cells are produced</li>
          <li><strong>Outer root sheath:</strong> Provides structural support and houses stem cells</li>
          <li><strong>Inner root sheath:</strong> Guides and shapes the growing hair</li>
        </ul>
        
        <h3>The Hair Growth Cycle: A Continuous Process</h3>
        <p>Hair growth occurs in a cyclical pattern consisting of three distinct phases. Understanding these phases is crucial for comprehending how hair loss occurs and how treatments work.</p>
        
        <h4>Anagen Phase: The Growth Stage</h4>
        <p>The anagen phase is the active growth period of hair follicles:</p>
        <ul>
          <li><strong>Duration:</strong> 2-7 years (varies by individual and location)</li>
          <li><strong>Characteristics:</strong> Continuous cell division in the hair matrix</li>
          <li><strong>Hair production:</strong> Approximately 1cm of growth per month</li>
          <li><strong>Follicle activity:</strong> High metabolic activity and blood flow</li>
          <li><strong>Percentage of hair:</strong> 85-90% of scalp hair at any given time</li>
        </ul>
        
        <p><strong>Factors affecting anagen duration:</strong></p>
        <ul>
          <li>Genetics (primary determinant)</li>
          <li>Age (shortens with aging)</li>
          <li>Hormonal status</li>
          <li>Nutritional status</li>
          <li>Overall health</li>
          <li>Stress levels</li>
        </ul>
        
        <h4>Catagen Phase: The Transition Stage</h4>
        <p>The catagen phase represents a brief transitional period:</p>
        <ul>
          <li><strong>Duration:</strong> 2-3 weeks</li>
          <li><strong>Process:</strong> Hair follicle begins to shrink</li>
          <li><strong>Cell activity:</strong> Rapid decrease in cellular division</li>
          <li><strong>Structural changes:</strong> Follicle detaches from dermal papilla</li>
          <li><strong>Hair fate:</strong> Hair stops growing but remains in follicle</li>
          <li><strong>Percentage:</strong> Less than 1% of scalp hair</li>
        </ul>
        
        <h4>Telogen Phase: The Resting Stage</h4>
        <p>The telogen phase is a period of follicle rest:</p>
        <ul>
          <li><strong>Duration:</strong> 3-4 months</li>
          <li><strong>Follicle state:</strong> Completely dormant</li>
          <li><strong>Hair characteristics:</strong> Hair becomes a "club hair"</li>
          <li><strong>Natural shedding:</strong> Hair eventually falls out</li>
          <li><strong>Preparation:</strong> Follicle prepares for next anagen phase</li>
          <li><strong>Percentage:</strong> 10-15% of scalp hair</li>
        </ul>
        
        <h3>Molecular Mechanisms of Hair Growth</h3>
        <h4>Growth Factors and Signaling Pathways</h4>
        <p>Hair growth is regulated by a complex network of molecular signals:</p>
        
        <p><strong>Key Growth Factors:</strong></p>
        <ul>
          <li><strong>IGF-1 (Insulin-like Growth Factor-1):</strong> Promotes anagen phase</li>
          <li><strong>VEGF (Vascular Endothelial Growth Factor):</strong> Supports blood vessel formation</li>
          <li><strong>FGF (Fibroblast Growth Factor):</strong> Stimulates follicle development</li>
          <li><strong>PDGF (Platelet-Derived Growth Factor):</strong> Promotes cell proliferation</li>
          <li><strong>TGF-β (Transforming Growth Factor-beta):</strong> Regulates hair cycle transitions</li>
        </ul>
        
        <p><strong>Important Signaling Pathways:</strong></p>
        <ul>
          <li><strong>Wnt/β-catenin pathway:</strong> Essential for hair follicle formation and cycling</li>
          <li><strong>BMP (Bone Morphogenetic Protein) pathway:</strong> Inhibits hair growth</li>
          <li><strong>Sonic hedgehog pathway:</strong> Controls follicle morphogenesis</li>
          <li><strong>Notch pathway:</strong> Regulates cell fate decisions</li>
        </ul>
        
        <h4>Stem Cells: The Regenerative Powerhouse</h4>
        <p>Hair follicle stem cells are crucial for continuous hair regeneration:</p>
        <ul>
          <li><strong>Location:</strong> Bulge region of the outer root sheath</li>
          <li><strong>Function:</strong> Generate new hair matrix cells</li>
          <li><strong>Activation:</strong> Triggered by specific molecular signals</li>
          <li><strong>Maintenance:</strong> Require proper niche environment</li>
          <li><strong>Therapeutic potential:</strong> Target for regenerative treatments</li>
        </ul>
        
        <h3>Hormonal Regulation of Hair Growth</h3>
        <h4>Androgens: The Double-Edged Hormones</h4>
        <p>Androgens have complex effects on hair growth:</p>
        
        <p><strong>Dihydrotestosterone (DHT):</strong></p>
        <ul>
          <li>Formed from testosterone by 5α-reductase enzyme</li>
          <li>Binds to androgen receptors in hair follicles</li>
          <li>Causes miniaturization of sensitive follicles</li>
          <li>Primary culprit in androgenetic alopecia</li>
          <li>Effects vary by follicle location and sensitivity</li>
        </ul>
        
        <p><strong>Testosterone:</strong></p>
        <ul>
          <li>Promotes hair growth in body and facial areas</li>
          <li>Can negatively affect scalp hair in sensitive individuals</li>
          <li>Converted to DHT in hair follicles</li>
          <li>Levels influenced by genetics, age, and health</li>
        </ul>
        
        <h4>Other Hormonal Influences</h4>
        <ul>
          <li><strong>Estrogen:</strong> Extends anagen phase, improves hair quality</li>
          <li><strong>Progesterone:</strong> Has anti-androgenic properties</li>
          <li><strong>Thyroid hormones:</strong> Essential for normal hair growth</li>
          <li><strong>Growth hormone:</strong> Supports overall hair health</li>
          <li><strong>Insulin:</strong> Affects hair follicle metabolism</li>
          <li><strong>Cortisol:</strong> Chronic elevation can impair hair growth</li>
        </ul>
        
        <h3>Nutritional Requirements for Optimal Hair Growth</h3>
        <h4>Macronutrients</h4>
        <p><strong>Proteins:</strong></p>
        <ul>
          <li>Hair is primarily composed of keratin protein</li>
          <li>Amino acids are building blocks of hair structure</li>
          <li>Deficiency leads to weak, brittle hair</li>
          <li>Requirements: 0.8-1.2g per kg body weight daily</li>
        </ul>
        
        <p><strong>Carbohydrates:</strong></p>
        <ul>
          <li>Provide energy for rapid cell division</li>
          <li>Support protein synthesis</li>
          <li>Complex carbohydrates preferred over simple sugars</li>
        </ul>
        
        <p><strong>Fats:</strong></p>
        <ul>
          <li>Essential fatty acids maintain scalp health</li>
          <li>Support hormone production</li>
          <li>Omega-3 and omega-6 ratios important</li>
        </ul>
        
        <h4>Micronutrients</h4>
        <p><strong>Vitamins:</strong></p>
        <ul>
          <li><strong>Biotin (B7):</strong> Cofactor for keratin synthesis</li>
          <li><strong>Vitamin D:</strong> Regulates hair follicle cycling</li>
          <li><strong>Vitamin C:</strong> Antioxidant, supports collagen synthesis</li>
          <li><strong>Vitamin E:</strong> Protects against oxidative stress</li>
          <li><strong>B-complex vitamins:</strong> Support cellular metabolism</li>
          <li><strong>Vitamin A:</strong> Important but excess can cause hair loss</li>
        </ul>
        
        <p><strong>Minerals:</strong></p>
        <ul>
          <li><strong>Iron:</strong> Essential for oxygen transport to follicles</li>
          <li><strong>Zinc:</strong> Required for protein synthesis and cell division</li>
          <li><strong>Selenium:</strong> Antioxidant properties</li>
          <li><strong>Copper:</strong> Involved in melanin production</li>
          <li><strong>Silica:</strong> Supports hair strength and elasticity</li>
        </ul>
        
        <h3>Environmental Factors Affecting Hair Growth</h3>
        <h4>Physical Stressors</h4>
        <ul>
          <li><strong>UV radiation:</strong> Damages hair proteins and scalp</li>
          <li><strong>Heat styling:</strong> Breaks down hair structure</li>
          <li><strong>Chemical treatments:</strong> Alter hair chemistry</li>
          <li><strong>Mechanical stress:</strong> Tight hairstyles, excessive brushing</li>
          <li><strong>Pollution:</strong> Oxidative stress on hair and scalp</li>
        </ul>
        
        <h4>Lifestyle Factors</h4>
        <ul>
          <li><strong>Sleep quality:</strong> Growth hormone released during deep sleep</li>
          <li><strong>Exercise:</strong> Improves circulation but excessive can increase cortisol</li>
          <li><strong>Stress management:</strong> Chronic stress disrupts hair cycles</li>
          <li><strong>Smoking:</strong> Reduces blood flow to follicles</li>
          <li><strong>Alcohol consumption:</strong> Can interfere with nutrient absorption</li>
        </ul>
        
        <h3>Age-Related Changes in Hair Growth</h3>
        <h4>Childhood and Adolescence</h4>
        <ul>
          <li>Rapid hair growth with long anagen phases</li>
          <li>Hormonal changes during puberty affect hair characteristics</li>
          <li>Hair color and texture may change</li>
        </ul>
        
        <h4>Adulthood</h4>
        <ul>
          <li>Stable hair growth patterns</li>
          <li>Gradual changes in hair density and quality</li>
          <li>Hormonal fluctuations (pregnancy, menopause) affect growth</li>
        </ul>
        
        <h4>Aging Process</h4>
        <ul>
          <li>Shortened anagen phases</li>
          <li>Decreased follicle size and activity</li>
          <li>Reduced melanin production (graying)</li>
          <li>Changes in hair texture and strength</li>
          <li>Slower growth rates</li>
        </ul>
        
        <h3>Optimizing Hair Growth: Evidence-Based Strategies</h3>
        <h4>Nutritional Optimization</h4>
        <ul>
          <li>Ensure adequate protein intake</li>
          <li>Maintain balanced micronutrient levels</li>
          <li>Consider targeted supplementation if deficient</li>
          <li>Stay properly hydrated</li>
          <li>Limit processed foods and excess sugar</li>
        </ul>
        
        <h4>Scalp Health Maintenance</h4>
        <ul>
          <li>Regular gentle massage to improve circulation</li>
          <li>Keep scalp clean but not over-cleansed</li>
          <li>Use appropriate products for your scalp type</li>
          <li>Protect from environmental damage</li>
          <li>Address scalp conditions promptly</li>
        </ul>
        
        <h4>Lifestyle Modifications</h4>
        <ul>
          <li>Manage stress through relaxation techniques</li>
          <li>Ensure adequate, quality sleep</li>
          <li>Exercise regularly but moderately</li>
          <li>Avoid smoking and limit alcohol</li>
          <li>Practice gentle hair care techniques</li>
        </ul>
        
        <h3>Future Directions in Hair Growth Science</h3>
        <h4>Emerging Research Areas</h4>
        <ul>
          <li><strong>Epigenetics:</strong> How environmental factors affect gene expression</li>
          <li><strong>Microbiome:</strong> Role of scalp bacteria in hair health</li>
          <li><strong>Regenerative medicine:</strong> Stem cell and tissue engineering approaches</li>
          <li><strong>Gene therapy:</strong> Correcting genetic causes of hair loss</li>
          <li><strong>Nanotechnology:</strong> Targeted delivery of growth factors</li>
        </ul>
        
        <h4>Therapeutic Innovations</h4>
        <ul>
          <li>3D bioprinting of hair follicles</li>
          <li>Personalized treatments based on genetic profiles</li>
          <li>Advanced growth factor therapies</li>
          <li>Improved drug delivery systems</li>
          <li>Artificial intelligence for treatment optimization</li>
        </ul>
        
        <h3>Practical Applications of Hair Growth Science</h3>
        <h4>Treatment Development</h4>
        <p>Understanding hair growth mechanisms has led to effective treatments:</p>
        <ul>
          <li><strong>Minoxidil:</strong> Extends anagen phase and improves blood flow</li>
          <li><strong>Finasteride:</strong> Blocks DHT production</li>
          <li><strong>PRP therapy:</strong> Provides growth factors directly to follicles</li>
          <li><strong>LLLT:</strong> Stimulates cellular energy production</li>
        </ul>
        
        <h4>Preventive Strategies</h4>
        <ul>
          <li>Early intervention based on genetic risk factors</li>
          <li>Lifestyle modifications to support optimal growth</li>
          <li>Regular monitoring of hair health parameters</li>
          <li>Personalized nutrition and supplementation</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>The science of hair growth reveals an intricate biological process involving complex molecular mechanisms, hormonal regulation, and environmental influences. This understanding provides the foundation for effective hair loss treatments and preventive strategies.</p>
        
        <p>As research continues to uncover new aspects of hair biology, we can expect more targeted and effective therapies to emerge. The key to maintaining healthy hair lies in understanding and supporting the natural growth processes through proper nutrition, lifestyle choices, and appropriate interventions when needed.</p>
        
        <p>By appreciating the remarkable complexity of hair growth, we can make informed decisions about hair care and treatment options, leading to better outcomes and healthier hair throughout our lives.</p>
      `,
    },
  ])

  // Blog upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadContent, setUploadContent] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadVideo, setUploadVideo] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
        setUploadPreview(reader.result as string);
        setUploadVideo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadVideo(reader.result as string);
        setUploadPreview(reader.result as string);
        setUploadImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle blog post submit
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadContent || (!uploadImage && !uploadVideo)) return;
    const newBlog: BlogPost = {
      id: Date.now(),
      title: uploadTitle,
      category: "User Blog",
      readTime: "Just now",
      excerpt: uploadContent.slice(0, 100) + "...",
      author: user?.displayName || "Anonymous",
      publishDate: new Date().toLocaleDateString(),
      tags: ["User", "Blog"],
      image: uploadImage || "",
      content: uploadContent,
    };
    setBlogPosts([newBlog, ...blogPosts]);
    setShowUpload(false);
    setUploadTitle("");
    setUploadContent("");
    setUploadImage(null);
    setUploadVideo(null);
    setUploadPreview(null);
  };

  const videos: VideoContent[] = [
    {
      id: 1,
      title: "Hair Loss Patterns and Treatment Options",
      expert: "Dr. Sarah Johnson, Dermatologist",
      duration: "15:30",
      topic: "Hair Loss",
    },
    {
      id: 2,
      title: "Advanced Hair Restoration Techniques",
      expert: "Dr. Michael Chen, Trichologist",
      duration: "22:45",
      topic: "Treatments",
    },
    {
      id: 3,
      title: "Understanding Hair Growth Cycles",
      expert: "Dr. Emily Rodriguez, Dermatologist",
      duration: "18:20",
      topic: "Hair Science",
    },
    {
      id: 4,
      title: "Nutrition and Hair Health Connection",
      expert: "Dr. James Wilson, Trichologist",
      duration: "12:15",
      topic: "Nutrition",
    },
    {
      id: 5,
      title: "Female Pattern Hair Loss: Diagnosis and Management",
      expert: "Dr. Lisa Thompson, Dermatologist",
      duration: "20:40",
      topic: "Women's Health",
    },
    {
      id: 6,
      title: "Hair Transplant: FUE vs FUT Techniques",
      expert: "Dr. Robert Martinez, Hair Surgeon",
      duration: "25:15",
      topic: "Surgery",
    },
    {
      id: 7,
      title: "PRP Therapy for Hair Loss: Evidence and Applications",
      expert: "Dr. Alexandra Kim, Regenerative Medicine",
      duration: "16:55",
      topic: "PRP Therapy",
    },
    {
      id: 8,
      title: "Scalp Conditions: Beyond Hair Loss",
      expert: "Dr. Jennifer Park, Dermatologist",
      duration: "19:30",
      topic: "Scalp Health",
    },
    {
      id: 9,
      title: "Hormonal Hair Loss in Men: Comprehensive Approach",
      expert: "Dr. David Brown, Endocrinologist",
      duration: "17:25",
      topic: "Men's Health",
    },
    {
      id: 10,
      title: "Hair Care Myths vs. Scientific Facts",
      expert: "Dr. Maria Garcia, Trichologist",
      duration: "14:10",
      topic: "Education",
    },
  ]

  const quizzes: Quiz[] = [
    {
      id: 1,
      title: "Hair Health Fundamentals",
      questions: 10,
      difficulty: "Beginner",
      certified: true,
      questionsData: [
        {
          id: 1,
          question: "What is the average number of hair follicles on the human scalp?",
          options: ["50,000-75,000", "100,000-150,000", "200,000-250,000", "300,000-350,000"],
          correctAnswer: 1,
          explanation: "The human scalp contains approximately 100,000 to 150,000 hair follicles, with the exact number determined at birth and varying between individuals."
        },
        {
          id: 2,
          question: "How much does hair typically grow per month?",
          options: ["0.5 cm", "1 cm", "1.5 cm", "2 cm"],
          correctAnswer: 1,
          explanation: "Hair grows approximately 1 centimeter (0.4 inches) per month, though this can vary based on genetics, age, health, and other factors."
        },
        {
          id: 3,
          question: "What percentage of hair is in the growth (anagen) phase at any given time?",
          options: ["50-60%", "70-80%", "85-90%", "95-100%"],
          correctAnswer: 2,
          explanation: "About 85-90% of hair is in the anagen (growth) phase at any given time, while the rest is in catagen (transition) or telogen (resting) phases."
        },
        {
          id: 4,
          question: "What is the main protein that makes up hair?",
          options: ["Collagen", "Elastin", "Keratin", "Fibrin"],
          correctAnswer: 2,
          explanation: "Keratin is the main structural protein that makes up hair, nails, and the outer layer of skin. It provides strength and resilience to hair strands."
        },
        {
          id: 5,
          question: "Which hormone is primarily responsible for male pattern baldness?",
          options: ["Testosterone", "DHT (Dihydrotestosterone)", "Estrogen", "Cortisol"],
          correctAnswer: 1,
          explanation: "DHT (Dihydrotestosterone) is the primary hormone responsible for male pattern baldness. It's created when testosterone is converted by the enzyme 5-alpha reductase."
        },
        {
          id: 6,
          question: "How long does the telogen (resting) phase of hair growth typically last?",
          options: ["1-2 months", "3-4 months", "6-8 months", "12 months"],
          correctAnswer: 1,
          explanation: "The telogen (resting) phase typically lasts 3-4 months, during which the hair follicle is dormant before eventually shedding the hair and beginning a new growth cycle."
        },
        {
          id: 7,
          question: "What is considered normal daily hair loss?",
          options: ["10-25 hairs", "50-100 hairs", "150-200 hairs", "250-300 hairs"],
          correctAnswer: 1,
          explanation: "Losing 50-100 hairs per day is considered normal. This is part of the natural hair cycle as hairs in the telogen phase shed to make way for new growth."
        },
        {
          id: 8,
          question: "Which nutrient deficiency is most commonly associated with hair loss?",
          options: ["Vitamin C", "Iron", "Vitamin E", "Calcium"],
          correctAnswer: 1,
          explanation: "Iron deficiency is one of the most common nutritional causes of hair loss, particularly in women. Iron is essential for carrying oxygen to hair follicles."
        },
        {
          id: 9,
          question: "At what age do men typically start experiencing male pattern baldness?",
          options: ["Teens", "20s-30s", "40s-50s", "60s+"],
          correctAnswer: 1,
          explanation: "Male pattern baldness can begin as early as the late teens and twenties, with about 25% of men experiencing some degree of hair loss by age 30."
        },
        {
          id: 10,
          question: "What is the best way to dry your hair to minimize damage?",
          options: ["High heat blow dryer", "Air drying", "Towel rubbing vigorously", "Low heat with heat protectant"],
          correctAnswer: 3,
          explanation: "Using low heat with a heat protectant product is the best compromise between styling needs and hair health. Air drying is gentlest, but low heat with protection minimizes damage while allowing styling."
        }
      ]
    },
    {
      id: 2,
      title: "Common Hair Diseases Recognition",
      questions: 12,
      difficulty: "Intermediate",
      certified: true,
      questionsData: [
        {
          id: 1,
          question: "What is the most common cause of hair loss worldwide?",
          options: ["Alopecia areata", "Androgenetic alopecia", "Telogen effluvium", "Trichotillomania"],
          correctAnswer: 1,
          explanation: "Androgenetic alopecia (male/female pattern baldness) is the most common cause of hair loss, affecting up to 50% of people over 50 years old."
        },
        {
          id: 2,
          question: "Which condition is characterized by sudden, patchy hair loss?",
          options: ["Androgenetic alopecia", "Alopecia areata", "Seborrheic dermatitis", "Scalp psoriasis"],
          correctAnswer: 1,
          explanation: "Alopecia areata is an autoimmune condition that causes sudden, patchy hair loss in round or oval areas, typically without scarring."
        },
        {
          id: 3,
          question: "What typically triggers telogen effluvium?",
          options: ["Genetics only", "Stress, illness, or hormonal changes", "Fungal infections", "Chemical exposure"],
          correctAnswer: 1,
          explanation: "Telogen effluvium is usually triggered by significant physical or emotional stress, illness, surgery, hormonal changes, or nutritional deficiencies."
        },
        {
          id: 4,
          question: "Which fungal infection commonly affects the scalp?",
          options: ["Candida", "Tinea capitis", "Aspergillus", "Cryptococcus"],
          correctAnswer: 1,
          explanation: "Tinea capitis (ringworm of the scalp) is the most common fungal infection affecting the scalp, particularly in children."
        },
        {
          id: 5,
          question: "What is the characteristic pattern of female pattern hair loss?",
          options: ["Receding hairline", "Diffuse thinning at the crown", "Patchy loss", "Complete baldness"],
          correctAnswer: 1,
          explanation: "Female pattern hair loss typically presents as diffuse thinning at the crown and widening of the central part, rather than a receding hairline."
        },
        {
          id: 6,
          question: "Which condition is associated with an itchy, flaky scalp?",
          options: ["Alopecia areata", "Androgenetic alopecia", "Seborrheic dermatitis", "Trichotillomania"],
          correctAnswer: 2,
          explanation: "Seborrheic dermatitis causes an itchy, flaky scalp with yellowish scales and can lead to hair loss if severe or untreated."
        },
        {
          id: 7,
          question: "What is traction alopecia caused by?",
          options: ["Genetics", "Hormones", "Tight hairstyles", "Medication"],
          correctAnswer: 2,
          explanation: "Traction alopecia is caused by repeated pulling or tension on hair from tight hairstyles like braids, ponytails, or extensions."
        },
        {
          id: 8,
          question: "Which type of alopecia is considered scarring (cicatricial)?",
          options: ["Androgenetic alopecia", "Alopecia areata", "Lichen planopilaris", "Telogen effluvium"],
          correctAnswer: 2,
          explanation: "Lichen planopilaris is a form of scarring alopecia that permanently destroys hair follicles, making regrowth impossible."
        },
        {
          id: 9,
          question: "What is the typical age of onset for male pattern baldness?",
          options: ["Childhood", "Teens to twenties", "Forties to fifties", "Over sixty"],
          correctAnswer: 1,
          explanation: "Male pattern baldness typically begins in the teens to twenties, with about 25% of men showing signs by age 30."
        },
        {
          id: 10,
          question: "Which condition involves compulsive hair pulling?",
          options: ["Alopecia areata", "Trichotillomania", "Telogen effluvium", "Androgenetic alopecia"],
          correctAnswer: 1,
          explanation: "Trichotillomania is a psychological condition characterized by the compulsive urge to pull out one's own hair."
        },
        {
          id: 11,
          question: "What distinguishes scarring from non-scarring alopecia?",
          options: ["Pain level", "Hair color change", "Follicle destruction", "Speed of onset"],
          correctAnswer: 2,
          explanation: "Scarring alopecia involves permanent destruction of hair follicles, preventing regrowth, while non-scarring alopecia preserves follicles for potential regrowth."
        },
        {
          id: 12,
          question: "Which hormone imbalance is associated with PCOS-related hair loss?",
          options: ["Low estrogen", "High testosterone/androgens", "Low thyroid hormone", "High cortisol"],
          correctAnswer: 1,
          explanation: "PCOS (Polycystic Ovary Syndrome) is associated with elevated androgens (testosterone and related hormones), which can cause male-pattern hair loss in women."
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Treatment Methods",
      questions: 15,
      difficulty: "Advanced",
      certified: true,
      questionsData: [
        {
          id: 1,
          question: "What is the mechanism of action of finasteride?",
          options: ["DHT receptor blocker", "5-alpha reductase inhibitor", "Vasodilator", "Growth factor stimulator"],
          correctAnswer: 1,
          explanation: "Finasteride works by inhibiting 5-alpha reductase, the enzyme that converts testosterone to DHT, thereby reducing DHT levels and preventing further hair loss."
        },
        {
          id: 2,
          question: "Which hair transplant technique leaves no linear scar?",
          options: ["FUT (Strip method)", "FUE (Follicular Unit Extraction)", "Both techniques", "Neither technique"],
          correctAnswer: 1,
          explanation: "FUE (Follicular Unit Extraction) involves harvesting individual follicles, leaving only tiny circular scars that are virtually undetectable, unlike FUT which leaves a linear scar."
        },
        {
          id: 3,
          question: "What concentration of minoxidil is FDA-approved for women?",
          options: ["1%", "2%", "5%", "Both 2% and 5%"],
          correctAnswer: 3,
          explanation: "Both 2% and 5% concentrations of minoxidil are FDA-approved for women, though 2% was approved first and 5% was later approved for better efficacy."
        },
        {
          id: 4,
          question: "How does PRP (Platelet-Rich Plasma) therapy work for hair loss?",
          options: ["Blocks DHT", "Provides growth factors", "Increases blood flow", "All of the above"],
          correctAnswer: 3,
          explanation: "PRP therapy works through multiple mechanisms: providing growth factors, increasing blood flow to follicles, and stimulating stem cells, making 'All of the above' the correct answer."
        },
        {
          id: 5,
          question: "What is the typical success rate of hair transplant procedures?",
          options: ["50-60%", "70-80%", "90-95%", "100%"],
          correctAnswer: 2,
          explanation: "Modern hair transplant procedures have a success rate of 90-95% when performed by experienced surgeons, with most transplanted hairs surviving and growing."
        },
        {
          id: 6,
          question: "Which medication is commonly used off-label for female pattern hair loss?",
          options: ["Finasteride", "Spironolactone", "Dutasteride", "All of the above"],
          correctAnswer: 3,
          explanation: "All three medications are used off-label for female pattern hair loss: spironolactone as an anti-androgen, and finasteride/dutasteride as DHT inhibitors in post-menopausal women."
        },
        {
          id: 7,
          question: "What is the recommended frequency for PRP treatments initially?",
          options: ["Once monthly for 6 months", "Every 2 weeks for 3 months", "Every 4-6 weeks for 3-4 sessions", "Once weekly for 8 weeks"],
          correctAnswer: 2,
          explanation: "The typical initial protocol for PRP is every 4-6 weeks for 3-4 sessions, followed by maintenance treatments every 3-6 months."
        },
        {
          id: 8,
          question: "Which technique allows for the highest number of grafts in a single session?",
          options: ["FUE", "FUT", "DHI", "All are equal"],
          correctAnswer: 1,
          explanation: "FUT (Follicular Unit Transplantation) typically allows for the highest number of grafts in a single session because it harvests a strip of scalp tissue."
        },
        {
          id: 9,
          question: "What is the mechanism of low-level laser therapy (LLLT) for hair loss?",
          options: ["Heat generation", "Photobiomodulation", "UV radiation", "Infrared heating"],
          correctAnswer: 1,
          explanation: "LLLT works through photobiomodulation, where specific wavelengths of light stimulate cellular activity and ATP production in hair follicles."
        },
        {
          id: 10,
          question: "Which JAK inhibitor was FDA-approved for alopecia areata?",
          options: ["Tofacitinib", "Baricitinib", "Ruxolitinib", "All of the above"],
          correctAnswer: 2,
          explanation: "Baricitinib was the first JAK inhibitor FDA-approved specifically for severe alopecia areata, though other JAK inhibitors are also being studied."
        },
        {
          id: 11,
          question: "What is the ideal donor hair density for successful transplantation?",
          options: ["Less than 50 FU/cm²", "60-80 FU/cm²", "100+ FU/cm²", "Density doesn't matter"],
          correctAnswer: 1,
          explanation: "A donor density of 60-80 follicular units per cm² is considered ideal for transplantation, providing enough hair while maintaining donor area appearance."
        },
        {
          id: 12,
          question: "How long does it typically take to see results from finasteride treatment?",
          options: ["1-2 months", "3-6 months", "6-12 months", "12-24 months"],
          correctAnswer: 2,
          explanation: "Finasteride typically takes 6-12 months to show visible results, as it works by preventing further loss first, then potentially improving hair quality and count."
        },
        {
          id: 13,
          question: "What is the contraindication for finasteride use in women?",
          options: ["Age over 50", "Pregnancy/childbearing potential", "Previous hair transplant", "Thyroid disease"],
          correctAnswer: 1,
          explanation: "Finasteride is contraindicated in women of childbearing potential due to the risk of birth defects in male fetuses, particularly genital abnormalities."
        },
        {
          id: 14,
          question: "Which stem cell source is most commonly used in hair restoration research?",
          options: ["Embryonic stem cells", "Adipose-derived stem cells", "Bone marrow stem cells", "Hair follicle stem cells"],
          correctAnswer: 1,
          explanation: "Adipose-derived stem cells (from fat tissue) are most commonly used in hair restoration research and treatments due to their accessibility and regenerative properties."
        },
        {
          id: 15,
          question: "What is the expected timeline for full hair transplant results?",
          options: ["3-6 months", "6-9 months", "12-18 months", "24+ months"],
          correctAnswer: 2,
          explanation: "Full hair transplant results typically take 12-18 months to mature, as transplanted hairs go through normal growth cycles and gradually thicken and develop."
        }
      ]
    },
    {
      id: 4,
      title: "Hair Care Product Knowledge",
      questions: 8,
      difficulty: "Beginner",
      certified: false,
      questionsData: [
        {
          id: 1,
          question: "What is the primary benefit of sulfate-free shampoos?",
          options: ["Better cleansing", "Less stripping of natural oils", "Faster hair growth", "Color protection only"],
          correctAnswer: 1,
          explanation: "Sulfate-free shampoos are gentler and less likely to strip the hair and scalp of natural oils, making them better for dry or damaged hair."
        },
        {
          id: 2,
          question: "Which ingredient should you look for in a moisturizing conditioner?",
          options: ["Alcohol", "Hyaluronic acid", "Sulfates", "Parabens"],
          correctAnswer: 1,
          explanation: "Hyaluronic acid can hold up to 1000 times its weight in water, making it an excellent moisturizing ingredient for hair care products."
        },
        {
          id: 3,
          question: "What is the purpose of heat protectant products?",
          options: ["Speed up styling", "Protect from UV rays", "Shield from heat damage", "Add volume"],
          correctAnswer: 2,
          explanation: "Heat protectant products create a barrier between your hair and hot styling tools, reducing protein damage and moisture loss."
        },
        {
          id: 4,
          question: "Which hair type benefits most from clarifying shampoos?",
          options: ["Dry hair", "Oily hair", "Color-treated hair", "Damaged hair"],
          correctAnswer: 1,
          explanation: "Oily hair benefits most from clarifying shampoos as they help remove excess oil, product buildup, and environmental pollutants more effectively."
        },
        {
          id: 5,
          question: "What is the main function of leave-in conditioners?",
          options: ["Deep cleansing", "Ongoing moisture and protection", "Color enhancement", "Heat generation"],
          correctAnswer: 1,
          explanation: "Leave-in conditioners provide ongoing moisture, detangling, and protection throughout the day without needing to be rinsed out."
        },
        {
          id: 6,
          question: "Which ingredient is commonly found in anti-dandruff shampoos?",
          options: ["Biotin", "Zinc pyrithione", "Keratin", "Collagen"],
          correctAnswer: 1,
          explanation: "Zinc pyrithione is a common active ingredient in anti-dandruff shampoos that helps control the fungus and bacteria that contribute to dandruff."
        },
        {
          id: 7,
          question: "How often should you use a deep conditioning treatment?",
          options: ["Daily", "Weekly", "Monthly", "Only when damaged"],
          correctAnswer: 1,
          explanation: "Deep conditioning treatments are typically recommended weekly for most hair types to maintain moisture and repair minor damage."
        },
        {
          id: 8,
          question: "What does 'pH-balanced' mean in hair care products?",
          options: ["High alkaline", "Matches hair's natural acidity", "Contains more proteins", "Added vitamins"],
          correctAnswer: 1,
          explanation: "pH-balanced hair products have a pH similar to hair's natural level (around 4.5-5.5), which helps maintain the hair cuticle and prevent damage."
        }
      ]
    },
    {
      id: 5,
      title: "Hair Nutrition and Supplements",
      questions: 10,
      difficulty: "Intermediate",
      certified: true,
      questionsData: [
        {
          id: 1,
          question: "Which vitamin deficiency is most commonly linked to hair loss?",
          options: ["Vitamin A", "Vitamin D", "Vitamin C", "Vitamin K"],
          correctAnswer: 1,
          explanation: "Vitamin D deficiency is strongly linked to alopecia areata and other forms of hair loss, as vitamin D receptors are found in hair follicles."
        },
        {
          id: 2,
          question: "What is the recommended daily biotin intake for hair health?",
          options: ["30 mcg", "100 mcg", "2500 mcg", "10,000 mcg"],
          correctAnswer: 0,
          explanation: "The recommended daily intake of biotin for adults is 30 mcg, though many hair supplements contain much higher doses (2500-10,000 mcg)."
        },
        {
          id: 3,
          question: "Which mineral is essential for iron absorption and hair health?",
          options: ["Zinc", "Vitamin C", "Copper", "Magnesium"],
          correctAnswer: 1,
          explanation: "Vitamin C significantly enhances iron absorption and is also important for collagen synthesis, which supports hair structure."
        },
        {
          id: 4,
          question: "What protein makes up approximately 95% of hair?",
          options: ["Collagen", "Elastin", "Keratin", "Fibrin"],
          correctAnswer: 2,
          explanation: "Keratin makes up about 95% of hair structure, which is why adequate protein intake is crucial for healthy hair growth."
        },
        {
          id: 5,
          question: "Which omega fatty acid is most beneficial for hair health?",
          options: ["Omega-3", "Omega-6", "Omega-9", "All equally"],
          correctAnswer: 0,
          explanation: "Omega-3 fatty acids are particularly beneficial for hair health due to their anti-inflammatory properties and role in maintaining scalp health."
        },
        {
          id: 6,
          question: "What is the optimal ferritin level for hair growth?",
          options: ["12-15 ng/mL", "40-70 ng/mL", "100+ ng/mL", "Any level above deficiency"],
          correctAnswer: 1,
          explanation: "For optimal hair growth, ferritin levels should be between 40-70 ng/mL, even though levels above 12-15 ng/mL are considered non-deficient."
        },
        {
          id: 7,
          question: "Which B vitamin is specifically important for preventing premature graying?",
          options: ["B1 (Thiamine)", "B5 (Pantothenic acid)", "B12 (Cobalamin)", "B6 (Pyridoxine)"],
          correctAnswer: 2,
          explanation: "Vitamin B12 deficiency is associated with premature graying, as it's involved in melanin production and DNA synthesis in hair follicles."
        },
        {
          id: 8,
          question: "How much protein should someone consume daily for optimal hair health?",
          options: ["0.5g per kg body weight", "0.8g per kg body weight", "1.2g per kg body weight", "2g per kg body weight"],
          correctAnswer: 2,
          explanation: "For optimal hair health, consuming 1.2g of protein per kg of body weight is recommended, which is higher than the basic RDA of 0.8g/kg."
        },
        {
          id: 9,
          question: "Which antioxidant helps protect hair from oxidative stress?",
          options: ["Vitamin E", "Vitamin C", "Selenium", "All of the above"],
          correctAnswer: 3,
          explanation: "All three - Vitamin E, Vitamin C, and Selenium - are important antioxidants that help protect hair follicles from oxidative stress and free radical damage."
        },
        {
          id: 10,
          question: "What is the relationship between zinc and hair loss?",
          options: ["No relationship", "Both deficiency and excess can cause hair loss", "Only deficiency causes hair loss", "Only excess causes hair loss"],
          correctAnswer: 1,
          explanation: "Both zinc deficiency and excess can cause hair loss. Deficiency impairs protein synthesis, while excess can interfere with copper absorption and cause toxicity."
        }
      ]
    },
    {
      id: 6,
      title: "Scalp Health and Conditions",
      questions: 12,
      difficulty: "Intermediate",
      certified: true,
      questionsData: [
        {
          id: 1,
          question: "What is the normal pH range of a healthy scalp?",
          options: ["3.0-4.0", "4.5-5.5", "6.0-7.0", "7.5-8.5"],
          correctAnswer: 1,
          explanation: "A healthy scalp maintains a slightly acidic pH of 4.5-5.5, which helps maintain the scalp's protective acid mantle and prevent bacterial overgrowth."
        },
        {
          id: 2,
          question: "Which fungus is most commonly associated with dandruff?",
          options: ["Candida albicans", "Malassezia furfur", "Trichophyton", "Aspergillus"],
          correctAnswer: 1,
          explanation: "Malassezia furfur (also known as Pityrosporum ovale) is the yeast most commonly associated with seborrheic dermatitis and dandruff."
        },
        {
          id: 3,
          question: "What is the primary difference between dry scalp and dandruff?",
          options: ["Color of flakes", "Size of flakes", "Cause and oiliness", "Treatment methods"],
          correctAnswer: 2,
          explanation: "Dry scalp is caused by lack of moisture and produces small, dry flakes, while dandruff is caused by excess oil and yeast overgrowth, producing larger, oilier flakes."
        },
        {
          id: 4,
          question: "How often should you wash your hair if you have an oily scalp?",
          options: ["Once a week", "Every other day", "Daily", "Twice daily"],
          correctAnswer: 2,
          explanation: "People with oily scalps typically benefit from daily washing to remove excess oil and prevent buildup that can lead to scalp issues."
        },
        {
          id: 5,
          question: "What is folliculitis?",
          options: ["Hair loss condition", "Inflammation of hair follicles", "Scalp dryness", "Premature graying"],
          correctAnswer: 1,
          explanation: "Folliculitis is the inflammation of hair follicles, usually caused by bacterial or fungal infection, resulting in red bumps or pustules on the scalp."
        },
        {
          id: 6,
          question: "Which ingredient is most effective for treating scalp psoriasis?",
          options: ["Tea tree oil", "Salicylic acid", "Biotin", "Keratin"],
          correctAnswer: 1,
          explanation: "Salicylic acid is most effective for scalp psoriasis as it helps remove scales and allows other medications to penetrate better."
        },
        {
          id: 7,
          question: "What is the recommended frequency for scalp massage?",
          options: ["Daily for 2-3 minutes", "Weekly for 15 minutes", "Monthly for 30 minutes", "Only when washing hair"],
          correctAnswer: 0,
          explanation: "Daily scalp massage for 2-3 minutes is recommended to improve blood circulation and potentially stimulate hair growth."
        },
        {
          id: 8,
          question: "Which condition causes thick, silvery scales on the scalp?",
          options: ["Seborrheic dermatitis", "Scalp psoriasis", "Folliculitis", "Contact dermatitis"],
          correctAnswer: 1,
          explanation: "Scalp psoriasis is characterized by thick, silvery scales and red patches, unlike the yellowish flakes of seborrheic dermatitis."
        },
        {
          id: 9,
          question: "What is the best water temperature for washing hair?",
          options: ["Hot water", "Lukewarm water", "Cold water", "Alternating hot and cold"],
          correctAnswer: 1,
          explanation: "Lukewarm water is best as it effectively cleanses without stripping natural oils or irritating the scalp like hot water can."
        },
        {
          id: 10,
          question: "Which scalp condition is associated with autoimmune dysfunction?",
          options: ["Dandruff", "Alopecia areata", "Seborrheic dermatitis", "Folliculitis"],
          correctAnswer: 1,
          explanation: "Alopecia areata is an autoimmune condition where the immune system attacks hair follicles, causing patchy hair loss."
        },
        {
          id: 11,
          question: "How long should you leave a medicated shampoo on your scalp?",
          options: ["Rinse immediately", "1-2 minutes", "5-10 minutes", "15+ minutes"],
          correctAnswer: 2,
          explanation: "Medicated shampoos should typically be left on the scalp for 5-10 minutes to allow the active ingredients to work effectively."
        },
        {
          id: 12,
          question: "What is the primary cause of contact dermatitis on the scalp?",
          options: ["Genetics", "Stress", "Allergic reactions to products", "Hormonal changes"],
          correctAnswer: 2,
          explanation: "Contact dermatitis on the scalp is primarily caused by allergic reactions to hair care products, dyes, or other chemicals that come in contact with the scalp."
        }
      ]
    }
  ]

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setQuizScore(0)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz!.questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score and show results
      let score = 0
      selectedAnswers.forEach((answer, index) => {
        if (answer === selectedQuiz!.questionsData[index].correctAnswer) {
          score++
        }
      })
      setQuizScore(score)
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setQuizScore(0)
  }

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return { message: "Excellent! You have outstanding knowledge of hair health.", color: "text-green-600", bgColor: "bg-green-50 border-green-200" }
    if (percentage >= 80) return { message: "Great job! You have good understanding of hair health.", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" }
    if (percentage >= 70) return { message: "Good work! You have basic knowledge with room for improvement.", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200" }
    return { message: "Keep learning! Review the educational content to improve your knowledge.", color: "text-red-600", bgColor: "bg-red-50 border-red-200" }
  }

  const renderQuizInterface = () => {
    if (!selectedQuiz) return null

    if (showResults) {
      const scoreInfo = getScoreMessage(quizScore, selectedQuiz.questionsData.length)
      const percentage = Math.round((quizScore / selectedQuiz.questionsData.length) * 100)

      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Quiz Results</h2>
                    <p className="text-white/90">{selectedQuiz.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Content */}
            <div className="p-6 space-y-6">
              {/* Score Display */}
              <div className={`p-6 rounded-2xl border-2 ${scoreInfo.bgColor}`}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                    {quizScore}/{selectedQuiz.questionsData.length}
                  </div>
                  <div className="text-2xl font-semibold mb-3 text-gray-800">
                    {percentage}% Score
                  </div>
                  <p className={`text-lg font-medium ${scoreInfo.color}`}>
                    {scoreInfo.message}
                  </p>
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Review Your Answers</h3>
                {selectedQuiz.questionsData.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{question.question}</h4>
                          <div className="space-y-2 text-sm">
                            <div className={`p-2 rounded-lg ${
                              isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              Your answer: {question.options[userAnswer]}
                            </div>
                            {!isCorrect && (
                              <div className="p-2 rounded-lg bg-green-50 text-green-700">
                                Correct answer: {question.options[question.correctAnswer]}
                              </div>
                            )}
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Back to Quizzes
                </button>
              </div>

              {/* Certification Note */}
              {selectedQuiz.certified && percentage >= 80 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Congratulations!</h4>
                      <p className="text-green-700 text-sm">You've earned a certificate for this quiz with a score of {percentage}%!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    const currentQ = selectedQuiz.questionsData[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedQuiz.questionsData.length) * 100

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
                  <p className="text-white/90">Question {currentQuestion + 1} of {selectedQuiz.questionsData.length}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{currentQ.question}</h3>
            
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-pink-500 bg-pink-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedAnswers[currentQuestion] !== undefined ? 'Answer selected' : 'Select an answer to continue'}
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 ${
                  selectedAnswers[currentQuestion] !== undefined
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestion === selectedQuiz.questionsData.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBlogDetail = (blog: BlogPost) => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedBlog(null)}
          className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Blog Posts</span>
        </button>

        {/* Article Header */}
        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium">
                  {blog.category}
                </span>
                <div className="flex items-center text-white/90 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {blog.readTime}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{blog.title}</h1>
            </div>
          </div>

          <div className="px-8 py-12">
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{blog.publishDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 text-sm px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  <Bookmark className="w-5 h-5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    </div>
  )

  const renderBlogs = () => {
    if (selectedBlog) {
      return renderBlogDetail(selectedBlog)
    }

    return (
      <div className="h-screen relative">
        <div className="text-center mb-8 px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Educational Blog Posts</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Regularly updated blog posts on various hair-related topics such as common diseases, treatments, prevention
            tips, and latest research.
          </p>
        </div>

        <ScrollStack
          className="px-4 sm:px-6 lg:px-8"
          itemDistance={120}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="15%"
          scaleEndPosition="5%"
          baseScale={0.9}
        >
          {blogPosts.map((post) => (
            <ScrollStackItem key={post.id} itemClassName="max-w-4xl mx-auto mb-8">
              <div
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedBlog(post)}
              >
                {/* Hero Image */}
                <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center text-white/90 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        {post.readTime}
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">{post.title}</h4>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-gray-500 text-sm">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Read Full Article</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    )
  }

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Educational Videos</h3>
        <p className="text-gray-600 max-w-3xl mx-auto px-4">
          Educational videos featuring dermatologists and trichologists discussing different hair issues, treatments,
          and techniques.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative bg-gradient-to-br from-pink-400 to-orange-400 h-40 sm:h-48 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300 cursor-pointer">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm font-medium">
                {video.duration}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                  {video.topic}
                </span>
                <Video className="w-5 h-5 text-gray-400" />
              </div>

              <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-2 line-clamp-2">{video.title}</h4>

              <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">{video.expert}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Quizzes</h3>
        <div className="space-y-4 max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 sm:p-6 rounded-xl border-l-4 border-pink-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2 text-pink-600" />
              Certified Quizzes
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              Quizzes designed to test users' knowledge on hair health and diseases, with certification upon completion.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 sm:p-6 rounded-xl border-l-4 border-orange-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
              Analysis of Quiz Results
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              Analysis of quiz results to provide personalized recommendations and educational content based on users'
              knowledge gaps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {quiz.certified && (
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-1 rounded-full">
                    <Award className="w-4 h-4" />
                  </div>
                )}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    quiz.difficulty === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : quiz.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <Brain className="w-5 h-5 text-gray-400" />
            </div>

            <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-3 line-clamp-2">{quiz.title}</h4>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{quiz.questions} Questions</span>
              {quiz.certified && (
                <span className="flex items-center text-pink-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Certification Available
                </span>
              )}
            </div>

            <button 
              onClick={() => startQuiz(quiz)}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100 text-gray-900'
      }`}
    >
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideInUp {
          from {
             opacity: 0;
             transform: translateY(30px);
           }
          to {
             opacity: 1;
             transform: translateY(0);
           }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

  {/* Sidebar */}
  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} darkMode={darkMode} />

      {/* Quiz Interface Overlay */}
      {selectedQuiz && renderQuizInterface()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className={
            darkMode
              ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-800'
              : 'bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-100'
          }
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-orange-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h1 className={
                darkMode
                  ? 'text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent mb-4'
                  : 'text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-4'
              }>
                Educational Content
              </h1>
              <p className={
                darkMode
                  ? 'text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4'
                  : 'text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4'
              }>
                Comprehensive educational resources to help you understand hair health, treatments, and best practices
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {!selectedBlog && (
          <div
            className={
              darkMode
                ? 'bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-800'
                : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100'
            }
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto">
                {[
                  { id: "blogs", label: "Blog Posts", icon: BookOpen },
                  { id: "videos", label: "Videos", icon: Video },
                  { id: "quizzes", label: "Quizzes", icon: Award },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                      activeSection === tab.id
                        ? "border-pink-500 text-pink-600 bg-pink-50/50"
                        : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!selectedBlog && (
          <main className="flex-1">
            {activeSection === "blogs" && (
              <div className={darkMode ? 'bg-gray-900' : ''}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-pink-600">Latest Blogs</h2>
                  <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:from-pink-600 hover:to-orange-600 transition-all" onClick={() => setShowUpload(true)}>
                    Post Blog
                  </button>
                </div>
                {showUpload && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <form className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative" onSubmit={handleBlogSubmit}>
                      <button type="button" className="absolute top-4 right-4 text-gray-500 hover:text-pink-600" onClick={() => setShowUpload(false)}>
                        <X className="w-6 h-6" />
                      </button>
                      <h2 className="text-2xl font-bold mb-4 text-pink-600">Create a Blog Post</h2>
                      <input
                        type="text"
                        placeholder="Blog Title"
                        className="w-full mb-4 px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={uploadTitle}
                        onChange={e => setUploadTitle(e.target.value)}
                        required
                      />
                      <textarea
                        placeholder="Write your blog content here..."
                        className="w-full mb-4 px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={uploadContent}
                        onChange={e => setUploadContent(e.target.value)}
                        rows={6}
                        required
                      />
                      <div className="mb-4 flex gap-4">
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="text-sm text-pink-600 mb-1">Upload Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          <BookOpen className="w-6 h-6 text-pink-500" />
                        </label>
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="text-sm text-pink-600 mb-1">Upload Video</span>
                          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                          <Video className="w-6 h-6 text-pink-500" />
                        </label>
                      </div>
                      {uploadPreview && (
                        <div className="mb-4">
                          {uploadImage && <img src={uploadImage} alt="Preview" className="rounded-xl w-full max-h-48 object-cover" />}
                          {uploadVideo && <video src={uploadVideo} controls className="rounded-xl w-full max-h-48 object-cover" />}
                        </div>
                      )}
                      <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-orange-600 transition-all">Post Blog</button>
                    </form>
                  </div>
                )}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {blogPosts.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
                      {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />}
                      {blog.image === "" && blog.content.includes("<video") && (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                          <span className="text-gray-500">Video Blog</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{blog.author}</span>
                          <span>{blog.publishDate}</span>
                        </div>
                        <button className="text-pink-500 font-semibold hover:underline" onClick={() => setSelectedBlog(blog)}>
                          Read More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === "videos" && (
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ${darkMode ? 'bg-gray-900' : ''}`}>{renderVideos()}</div>
            )}
            {activeSection === "quizzes" && (
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ${darkMode ? 'bg-gray-900' : ''}`}>{renderQuizzes()}</div>
            )}
          </main>
        )}

        {/* Blog Detail View */}
        {selectedBlog && renderBlogDetail(selectedBlog)}
      </div>
    </div>
  )
}

export default Education