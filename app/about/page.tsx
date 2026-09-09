"use client"

import Image from "next/image"
import Link from "next/link"

import { ChevronRight, Award, Users, Play, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect, useRef } from "react"

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          const duration = 2000
          const steps = 30
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return <div ref={ref}>{count}{suffix}</div>
}

const programs = [
  "Hatha Yoga", "Ashtanga Yoga", "Iyengar Yoga",
  "Meditation", "Pranayama", "Yoga Philosophy",
  "Yoga Anatomy", "Mantra Chanting", "Teaching Methodology",
]

const features = [
  { title: "Certified Instructors", desc: "Our yoga programs are led by highly certified and experienced instructors who bring years of practice, teaching expertise, and wellness knowledge." },
  { title: "Holistic Approach", desc: "We believe yoga goes far beyond physical postures. Our curriculum integrates mindfulness, breathwork, meditation, and lifestyle wellness." },
  { title: "Yoga Alliance Accredited", desc: "As a Yoga Alliance USA registered school, our TTC programs meet international standards for yoga teacher certification." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#264020]/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="animate-fade-in-up text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-[#264020]/10 text-[#264020] rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#264020] leading-tight mb-6">
              Discover Your Inner Balance & Take Your Yoga to The Peak
            </h1>
            <p className="text-lg text-[#264020]/70 max-w-2xl mx-auto leading-relaxed">
              Welcome to a holistic experience that will transform you from within. Dive into a soothing learning journey by engaging with the science and power of Yoga — online, anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=750&fit=crop"
                  alt="Yoga Practice"
                  width={600}
                  height={750}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#264020]" />
                  <span className="text-sm font-medium text-[#264020]">Yoga Alliance RYS</span>
                </div>
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-serif text-3xl md:text-4xl text-[#264020] mb-6">
                Yoga With Srinatha – An Internationally Certified Yoga School
              </h2>
              <p className="text-[#264020]/70 leading-relaxed mb-4">
                Founded by Dr. Balasundra Srinatha to make the traditional and correct form of Yoga accessible to all, around the world — through online courses, teacher training programs, and guided practices.
              </p>
              <p className="text-[#264020]/70 leading-relaxed mb-6">
                Our mission is to create a sacred digital space for serious yoga practitioners to develop their practice — physically, mentally and spiritually — no matter where they are.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white px-6 rounded-full">
                    Explore Programs
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/teachers">
                  <Button variant="outline" className="border-[#264020] text-[#264020] hover:bg-[#264020]/5 px-6 rounded-full">
                    Meet Our Teachers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: 25, suffix: "+", label: "Yoga Style Workout" },
              { value: 60, suffix: "k+", label: "Active & Happy Members" },
              { value: 30, suffix: "+", label: "Years Of Experience" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="animate-fade-in-up text-center"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="font-serif text-4xl md:text-5xl text-[#264020] font-semibold">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[#264020]/60 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="animate-fade-in-up bg-white rounded-2xl p-8 border border-[#E5E5E5]"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#264020]" />
                </div>
                <h3 className="font-serif text-xl text-[#264020] mb-3">{feature.title}</h3>
                <p className="text-[#264020]/70 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video + Quote */}
      <section className="py-20 px-4 bg-[#264020]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => window.open("https://www.youtube.com/watch?v=CJx3ChBjMe8", "_blank")}>
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=720&h=480&fit=crop"
                alt="Yoga with Srinatha"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-[#264020] ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="animate-fade-in-up text-center md:text-left">
              <blockquote className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed mb-6">
                &ldquo;Yoga is not a work-out it is a work-in, and this is the point of spiritual practice to make us teachable to open up our hearts and focus our awareness so that we can know what we already know and be who we already are.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Image
                  src="/teachers/Dr.Srinatha.webp"
                  alt="Dr. Srinatha"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-white font-medium">Dr. Srinatha</p>
                  <p className="text-white/60 text-sm">Founder, Srinatha Yoga School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-3xl md:text-4xl text-[#264020] mb-6">Meet Dr. Srinatha</h2>
              <p className="text-[#264020]/70 leading-relaxed mb-4">
                Dr. Srinatha is blessed and privileged to learn and practice with B.K.S Iyengar, Sri Gopaljeeyar and other senior Yoga Gurus of India. His experience of more than 30 Years in teaching Yoga worldwide enables him to understand the mind and body of the students, the over-enthusiasm and the restrictions created by the students, which need to be balanced to become a true yoga practitioner and a great yoga teacher.
              </p>
              <p className="text-[#264020]/70 leading-relaxed">
                He has designed a specific set of series and sequences to make all levels of practitioners feel easy, effective, prepared and safe in his classes — now available online for students worldwide.
              </p>
            </div>
            <div className="animate-fade-in-up relative" style={{ animationDelay: "0.2s" }}>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/teachers/Dr.Srinatha.webp"
                  alt="Dr. Srinatha"
                  width={500}
                  height={667}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#264020]" />
                  <span className="text-sm font-medium text-[#264020]">30+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Info */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in-up text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-[#264020] mb-6">Our Online Yoga School</h2>
            <p className="text-[#264020]/70 leading-relaxed mb-6">
              This Yoga Alliance Certified Yoga School is established with the vision to create a sacred space for serious yoga practitioners to develop their practice – physically, mentally and spiritually. Our team of Yoga masters from Mysore and other parts of India, believe in a dedicated and in-depth step-by-step approach to teach yoga online.
            </p>
            <p className="text-[#264020]/70 leading-relaxed">
              The experience and knowledge shared in our online yoga classes, workshops, and teacher training programs allow students worldwide to make their yoga practice more meaningful and awakened.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {programs.map((program, idx) => (
              <div
                key={program}
                className="animate-fade-in-up flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <CheckCircle className="w-5 h-5 text-[#264020] shrink-0" />
                <span className="text-[#264020]/80 font-medium">{program}</span>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up bg-[#264020] rounded-2xl p-10 md:p-14 text-center">
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Begin Your Online Yoga Journey</h3>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              If you feel inspired by our vision and dedication, join the Yoga With Srinatha community and grow your practice with us — from anywhere in the world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/courses">
                <Button className="bg-white text-[#264020] hover:bg-white/90 px-8 rounded-full">
                  Explore Programs
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 rounded-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
