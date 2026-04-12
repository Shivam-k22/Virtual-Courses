import React from 'react'
import about from "../assets/about.jpg"
import { BiSolidBadgeCheck } from "react-icons/bi"
import { HiOutlineAcademicCap } from "react-icons/hi2"
import { useNavigate } from 'react-router-dom'

const features = [
  { label: 'Simplified Learning', desc: 'Structured paths for every level'   },
  { label: 'Expert Trainers',     desc: 'Learn from industry professionals'  },
  { label: 'Big Experience',      desc: '10+ years of quality education'      },
  { label: 'Lifetime Access',     desc: 'Learn at your own pace, forever'    },
]

function About() {
  const navigate = useNavigate()

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* ── Image column ── */}
        <div className="lg:w-5/12 w-full flex items-center justify-center relative flex-shrink-0">

          <div className="relative z-10 w-full max-w-sm">
            <img
              src={about}
              className="w-full rounded-3xl object-cover shadow-2xl border-4 border-white"
              alt="About our platform"
            />

            {/* Floating satisfaction badge */}
            <div className="absolute -bottom-5 -right-4 bg-blue-600 text-white font-black text-sm px-5 py-3 rounded-2xl shadow-xl">
              <span className="text-2xl font-black block">98%</span>
              <span className="text-xs font-bold uppercase tracking-wider">Satisfaction</span>
            </div>

            {/* Floating learners badge */}
            <div className="absolute -top-4 -left-4 bg-white border border-blue-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2">
              <HiOutlineAcademicCap className="w-5 h-5 text-blue-500" />
              <span>50K+ Learners</span>
            </div>
          </div>

        {/* ── Text column ── */}
        <div className="lg:w-7/12 w-full flex flex-col gap-6">

          <span className="text-xs font-extrabold tracking-widest uppercase text-blue-500">
            — About Us
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            We Maximize Your{' '}
            <span className="text-blue-600">Learning Growth</span>
          </h2>

          <p className="text-slate-500 text-base leading-relaxed max-w-lg">
            We provide a modern Learning Management System to simplify online education,
            track progress, and enhance student-instructor collaboration efficiently.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {features.map(({ label, desc }) => (
              <div
                key={label}
                className="group flex items-start gap-4 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <BiSolidBadgeCheck className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">{label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
           onClick={() => navigate("/about")}
           className="self-start mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
            Learn More About Us
          </button>
        </div>
        </div>
      </div>
    </section>)}

export default About
