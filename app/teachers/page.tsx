"use client"

import Image from "next/image"
import Link from "next/link"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Expert trainers from the official website
const teamMembers = [
  {
    name: "Dr. Srinatha",
    role: "Founder and Director",
    image: "/teachers/Dr.Srinatha.webp",
    bgColor: "#264020",
  },
  {
    name: "Ravi Prabhakar",
    role: "Methodology, Anatomy & Physiology Teacher",
    image: "/teachers/ravi.webp",
    bgColor: "#7BA3A8",
  },
  {
    name: "Vinayaka Honnavar",
    role: "Yoga Philosophy, Meditation & Sound Healing",
    image: "/teachers/vinayak.webp",
    bgColor: "#8B9D83",
  },
  {
    name: "Sahana P R",
    role: "Yin Yoga, Prenatal & Postnatal, Anatomy",
    image: "/teachers/Sahana.webp",
    bgColor: "#9DB4C0",
  },
  {
    name: "Hrishanth",
    role: "Yoga Therapy & Ashtanga Yoga Teacher",
    image: "/teachers/hrishanth.webp",
    bgColor: "#A89F91",
  },
  {
    name: "Minu Sajji",
    role: "Pranayama, Wheel and Chair Yoga Teacher",
    image: "/teachers/minu.webp",
    bgColor: "#B5838D",
  },
  {
    name: "Charanya",
    role: "Ayurveda, Philosophy & Pranayama Teacher",
    image: "/teachers/charanya.webp",
    bgColor: "#C4A484",
  },
{
    name: "Anulasha Ram",
    role: "Aerial Yoga Teacher & Marketing Head",
    image: "/teachers/Anu.webp",
    bgColor: "#8B8B6B",
  },
]

// 7 Core Values
const coreValues = [
  {
    number: "1",
    title: "Service Before The Self",
    description:
      "We put the needs of our community before our own needs. We put service to the community before profits. We never take decisions based on how much money, fame or benefit we will gain. We make decisions based on how much impact we'll create in the lives for our community.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    imageLeft: true,
  },
  {
    number: "2",
    title: "Simplicity In Delivery",
    description:
      "Our knowledge is communicated with such clarity that even a five-year-old can grasp it effortlessly. We consciously avoid complex jargon and overly technical language. Whether it's our videos, books, social media, even work structure, or clothing, we always strive for simplicity.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop",
    imageLeft: false,
  },
  {
    number: "3",
    title: "Profoundness Of Wisdom",
    description:
      "Our teachings are deeply profound, rooted in the Vedas and the ancient scriptures. Yet, we also use modern scientific insights to back it up. We do not share anything based on our personal opinions or trends.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    imageLeft: true,
  },
  {
    number: "4",
    title: "Practicality Of Teachings",
    description:
      "We don't just share 'why' to do something, or 'what' to do. We also always share the 'how'. At the end of any theory, we tell people how to exactly bring it into implementation the very next day. In other words, we lay out a detailed path to follow any teaching in one's day-to-day, everyday life.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    imageLeft: false,
  },
  {
    number: "5",
    title: "Under Promising, But Over Delivering",
    description:
      "We strive to over deliver in everything we do. Whether we create a design, shoot a video, create a workshop or organise an event, it is done in the highest possible quality, and we strive to do more than what is expected. We never do 'kaam chalau' work.\n\nWe use the best quality equipment. There are never any grammatical errors in our writing. There are no ordinary workshops we create. Satvic Movement is known for always going over and above and no one compromises it.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    imageLeft: true,
  },
  {
    number: "6",
    title: "Empowerment, Not Dependency",
    description:
      "We help our community break free from dependencies. Whether it's the dependency on pills, on addictive substances, on people, or even the dependency on us. Rather, we teach them how to stand on their own feet.\n\nWe don't just give them a diet plan. We teach them how to craft a diet plan so in the future, they can do it for themselves, even without us. We don't just tell someone to do a certain action. We tell them exactly WHY to do it, so they can become their own health guide, and be fully self-sufficient.",
    image: "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=600&h=400&fit=crop",
    imageLeft: false,
  },
  {
    number: "7",
    title: "A Spirit Of Joy",
    description:
      "Satvic Movement is a happy place where joy is constant. Whatever we do, we have fun while doing it. In our courses, we add fun elements so the overall vibe is youthful and joyful, and there are no dull moments (kirtans, team dances, quizzes, surprises, gifts, etc). We like to celebrate small achievements. We like to mark milestones. We love celebrating life!",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    imageLeft: true,
  },
]

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-serif text-4xl lg:text-5xl text-[#264020] mb-6">Meet the Team</h1>
            <p className="text-[#264020]/70 max-w-2xl mx-auto text-lg leading-relaxed">
              The Srinatha team consists of 40 passionate individuals spread across India.
              Though we work mostly remotely, we&apos;re closely connected by the shared purpose
              of creating a Satvic World.
            </p>
          </div>
        </section>

        {/* Team Grid — Satvic-style cards */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-6 gap-y-16">
              {teamMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="animate-fade-in-up flex flex-col items-center glass-card-hover rounded-2xl p-4 transition-all duration-300"
                  style={{ animationDelay: `${(index % 5) * 0.07}s` }}
                >
                  {/* Card: colored rounded box with photo overflowing the top */}
                  <div className="relative w-full" style={{ paddingTop: "24px" }}>
                    {/* Colored background box */}
                    <div
                      className="w-full rounded-xl"
                      style={{ backgroundColor: member.bgColor, height: "160px" }}
                    />
                    {/* Photo — overflows the top of the box */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: 0, width: "90%", height: "190px" }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center mt-3 px-1">
                    <h3 className="font-sans font-semibold text-[#1a1a1a] text-sm leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-[#555] text-xs leading-snug mt-0.5">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our 7 Core Values */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl lg:text-4xl text-[#1a1a1a] mb-2">Our 7 Core Values</h2>
            </div>

            <div className="space-y-16">
              {coreValues.map((value, index) => (
                <div
                  key={value.number}
                  className={`animate-fade-in-up flex flex-col ${value.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5 shrink-0">
                    <div className="relative w-full h-60 md:h-52 rounded-2xl overflow-hidden glass-card">
                      <Image
                        src={value.image}
                        alt={value.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-3/5">
                    <h3 className="font-sans font-semibold text-[#1a1a1a] text-lg mb-3">
                      {value.number}. {value.title}
                    </h3>
                    {value.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-[#444] text-sm leading-relaxed mb-3 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-20 bg-[#264020]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">Join Our Team</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              If you want to help others on this Satvic Journey, reach out to us.
              Even if we don&apos;t have an open role for you, we&apos;d love to hear about you.
            </p>
            <a href="mailto:info@srinathayoga.com">
              <Button className="bg-white text-[#264020] hover:bg-white/90 px-8 py-6 text-lg">
                Fill The Form
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
