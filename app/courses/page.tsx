"use client"

import Image from "next/image"
import Link from "next/link"

import { ChevronLeft, Star, Calendar, Clock, CheckCircle, Award, Download, Instagram, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { fetchCourses } from "@/lib/supabase-queries"
import type { Course as AppCourse } from "@/lib/app-data"

interface DisplayCourse {
  id: string
  title: string
  rating: number
  reviews: number
  description: string
  duration: string
  language: string
  price: { inr: number; usd: number }
  certified: boolean
  recommended: boolean
  image: string
  features: string[]
  level: string
  instructor: string
}

function inferFeatures(level: string): string[] {
  if (level === 'Teacher Training') {
    return ['Teaching Methods', 'Yoga Philosophy', 'Certificate']
  }
  return ['Asanas', 'Meditation', 'Daily Practice']
}

function priceToUSD(inr: number): number {
  return Math.round(inr / 83)
}

// Educators
const educators = [
  {
    name: "Dr. Srinatha",
    bio: "Dr. Srinatha is the Founder and Director with 30+ years experience. He is a senior teacher of Hatha Yoga, Iyengar Yoga, and Ashtanga Yoga.",
    image: "/teachers/Dr.Srinatha.webp",
  },
  {
    name: "Sahana P R",
    bio: "Sahana specializes in Yin Yoga, Prenatal and Postnatal Yoga, and Applied Yoga Anatomy.",
    image: "/teachers/Sahana.webp",
  },
  {
    name: "Hrishanth",
    bio: "Hrishanth is a Yoga Therapy teacher and Ashtanga Yoga instructor specializing in therapeutic yoga.",
    image: "/teachers/hrishanth.webp",
  },
  {
    name: "Charanya",
    bio: "Charanya teaches Ayurveda, Yoga Philosophy, and Pranayama with deep traditional knowledge.",
    image: "/teachers/charanya.webp",
  },
]

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [allCourses, setAllCourses] = useState<DisplayCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const filters = ["All", "Beginner", "Intermediate", "Teacher Training", "Specialized"]

  useEffect(() => {
    fetchCourses().then(data => {
      setAllCourses(data.map((c: AppCourse) => ({
        id: c.id,
        title: c.title,
        rating: c.rating,
        reviews: c.reviews,
        description: c.description,
        duration: c.duration,
        language: 'English',
        price: { inr: c.price, usd: priceToUSD(c.price) },
        certified: c.certificateEligible,
        recommended: c.title.includes('200 Hour'),
        image: c.image,
        features: inferFeatures(c.level),
        level: c.level,
        instructor: c.instructor,
      })))
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  const filteredCourses = activeFilter === "All" 
    ? allCourses 
    : allCourses.filter(course => course.level === activeFilter)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="Logo" width={48} height={48} />
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl text-[#264020] mb-4">Satvic Yoga</h1>
            <p className="text-[#264020]/60 mb-6">The Yoga Wing of Srinatha Movement</p>
            
            <p className="text-[#264020]/70 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
              At Satvic Yoga, we bring ancient yogic wisdom into your modern lifestyle. 
              Apart from sharing Yogic Philosophy, we focus on four essential practices: 
              asanas, breath-work, chanting, and dhyana which we call the ABCD of Yoga.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <p className="font-serif text-3xl text-[#264020] font-bold">200k+</p>
                <p className="text-[#264020]/60 text-sm">Lives Transformed</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl text-[#264020] font-bold">1 Million+</p>
                <p className="text-[#264020]/60 text-sm">People Participated</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl text-[#264020] font-bold">10 Years+</p>
                <p className="text-[#264020]/60 text-sm">Teaching Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Certification Badges */}
        <section className="py-6 bg-white border-y border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-4 py-2 rounded border border-[#E5E5E5]">
              <Award className="w-5 h-5 text-[#264020]" />
              <span className="text-sm font-medium text-[#264020]">Yoga Alliance RYS Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-4 py-2 rounded border border-[#E5E5E5]">
              <CheckCircle className="w-5 h-5 text-[#264020]" />
              <span className="text-sm font-medium text-[#264020]">YACP Accredited</span>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-[#264020] text-white"
                      : "bg-[#FAF8F5] text-[#264020] hover:bg-[#264020]/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl text-[#264020]">Upcoming Yoga Programs</h2>
              <p className="text-[#264020]/60">Deepen your learnings over 3 levels</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && (
                <div className="col-span-full flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
                </div>
              )}
              {!isLoading && filteredCourses.map((course, index) => (
                <div
                  key={course.title}
                  className="animate-fade-in-up satvic-card glass-card rounded-2xl overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                    {course.recommended && (
                      <div className="absolute top-3 right-3 bg-[#264020] text-white text-xs px-3 py-1 rounded">
                        Highly Recommended
                      </div>
                    )}
                    {course.certified && (
                      <div className="absolute top-3 left-3 bg-white text-[#264020] text-xs px-3 py-1 rounded flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Yoga Alliance
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-[#264020]/80 text-white text-xs px-2 py-1 rounded">
                      {course.level}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-xl text-[#264020] mb-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#264020] text-[#264020]" />
                      ))}
                      <span className="text-sm text-[#264020]/60 ml-1">
                        ({course.rating}) {course.reviews} Reviews
                      </span>
                    </div>

                    <p className="text-[#264020]/70 text-sm mb-4 leading-relaxed">{course.description}</p>

                    <div className="flex items-center gap-3 text-sm text-[#264020]/60 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1 mb-4">
                      {course.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#264020]/60">
                          <CheckCircle className="w-3 h-3 text-[#264020]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                      <div>
                        <span className="text-[#264020] font-bold text-lg">₹{course.price.inr.toLocaleString()}</span>
                        <span className="text-[#264020]/50 text-sm ml-2">/ ${course.price.usd}</span>
                      </div>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white text-sm">
                          Register Now
                        </Button>
                      </Link>
                    </div>

                    {/* Download Syllabus */}
                    <button
                      onClick={() => alert('Syllabus PDF coming soon. Contact us for details.')}
                      className="w-full mt-3 flex items-center justify-center gap-2 text-[#264020] text-sm hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download Syllabus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet The Educators */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl text-[#264020] mb-4">Meet The Educators</h2>
              <p className="text-[#264020]/60">Leading Srinatha Movement&apos;s Yoga Wing</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {educators.map((educator, index) => (
                <div
                  key={educator.name}
                  className="animate-fade-in-up glass-card rounded-2xl p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image src={educator.image} alt={educator.name} fill className="object-cover rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#264020] mb-1">{educator.name}</h3>
                      <p className="text-[#264020]/60 text-sm leading-relaxed">{educator.bio}</p>
                      <Link href="/teachers" className="text-[#264020] font-medium text-sm mt-2 hover:underline block">Read more</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Section */}
        <section className="py-16 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[#264020] font-serif text-2xl mb-2">रं</p>
            <h2 className="font-serif text-2xl text-[#264020] mb-4">Satvic Yoga On Instagram</h2>
            <p className="text-[#264020]/60 mb-6">For daily yogic wisdom and inspiration</p>
            <a href="https://www.instagram.com/yogawithsrinatha/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">
                <Instagram className="mr-2 h-4 w-4" />
                Visit The Instagram Page
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
