import React from 'react'
import heroImage from "../assets/homelogo.jpg"
import Nav from '../components/Nav'
import { SiViaplay } from "react-icons/si"
import { HiOutlineAcademicCap } from "react-icons/hi2"
import { FaCode, FaStar, FaBookOpen } from "react-icons/fa"
import Logos from '../components/Logos'
import Cardspage from '../components/Cardspage'
import ExploreCourses from '../components/ExploreCourses'
import About from '../components/About'
import ReviewPage from '../components/ReviewPage'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="w-full overflow-hidden bg-white">

      {/* ── NAV ── */}
      <Nav />

      {/* ── HERO ── */}
      <section
        className="w-full min-h-screen flex items-center px-6 md:px-16 lg:px-24 pt-6 pb-16 overflow-hidden relative bg-white"
      >

        {/* Floating decorative dots top left */}
        <div className="absolute top-16 left-8 grid grid-cols-4 gap-3 opacity-25 pointer-events-none">
          {Array(16).fill(0).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          ))}
        </div>

        {/* Floating decorative dots bottom right */}
        <div className="absolute bottom-16 right-10 grid grid-cols-4 gap-3 opacity-20 pointer-events-none">
          {Array(16).fill(0).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">

          {/* ── LEFT: Text ── */}
          <div className="lg:w-[40%] w-full flex flex-col items-start">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 shadow-sm">
              <HiOutlineAcademicCap className="w-4 h-4" />
              Online Learning Platform
            </div>

            {/* Headline */}
            <h1
              className="font-black text-slate-900 leading-[1.35] tracking-tight mb-6"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.01em' }}
            >
              <span className="text-4xl sm:text-5xl lg:text-[58px] block">Grow Your{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Skills
                </span>
              </span>
              <span className="text-4xl sm:text-5xl lg:text-[58px] block">Learn Without</span>
              <span className="text-4xl sm:text-5xl lg:text-[58px] text-blue-600 block">Limits</span>
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-base lg:text-lg max-w-md leading-relaxed mb-8" style={{ fontFamily: "'Georgia', serif" }}>
              Master in-demand skills with expert-led courses. Join 50,000+ learners and unlock your full potential — at your own pace, from anywhere.
            </p>

            {/* Mini stat pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full text-sm font-semibold text-slate-700">
                <FaCode className="text-blue-500 w-3.5 h-3.5" />
                200+ Courses
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full text-sm font-semibold text-slate-700">
                <FaStar className="text-yellow-400 w-3.5 h-3.5" />
                4.9 Rating
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full text-sm font-semibold text-slate-700">
                <FaBookOpen className="text-violet-500 w-3.5 h-3.5" />
                Lifetime Access
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => navigate("/allcourses")}
                className="group inline-flex items-center gap-3 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}
              >
                Start Learning
                <SiViaplay className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold text-sm px-8 py-4 rounded-2xl transition-all duration-200 shadow-sm"
              >
                Learn About Us
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { num: '50K+', label: 'Students' },
                { num: '200+', label: 'Courses' },
                { num: '98%', label: 'Satisfaction' },
                { num: '40+', label: 'Instructors' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-900">{s.num}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                  {i < 3 && <div className="w-px h-8 bg-slate-200" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image Block ── */}
          <div className="lg:w-[60%] w-full flex items-center justify-center relative min-h-[640px]">

            {/* Radial fade mask — fades image edges into white bg */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse 74% 78% at 55% 50%, transparent 50%, rgba(255,255,255,0.5) 68%, white 85%)',
              }}
            />

            {/* The image — multiply blends white bg away, mask softens all edges */}
            <img
              src={heroImage}
              alt="Developer learning online"
              className="relative z-[5] w-full h-auto object-contain"
              style={{
                mixBlendMode: 'multiply',
                WebkitMaskImage: 'radial-gradient(ellipse 90% 92% at 50% 50%, black 52%, transparent 82%)',
                maskImage: 'radial-gradient(ellipse 90% 92% at 50% 50%, black 52%, transparent 82%)',
                maxWidth: '1100px',
                marginRight: '-60px',
              }}
            />
          </div>

        </div>
      </section>

      {/* Rest of page */}
      <div className="bg-white">
        <Logos />
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
        <Footer />
      </div>
    </div>
  )
}

export default Home