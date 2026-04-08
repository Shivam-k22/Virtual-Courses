import React from 'react'
import { SiViaplay } from "react-icons/si"
import { TbDeviceDesktopAnalytics } from "react-icons/tb"
import { LiaUikit } from "react-icons/lia"
import { MdAppShortcut } from "react-icons/md"
import { FaHackerrank } from "react-icons/fa"
import { TbBrandOpenai } from "react-icons/tb"
import { SiGoogledataproc } from "react-icons/si"
import { BsClipboardDataFill } from "react-icons/bs"
import { SiOpenaigym } from "react-icons/si"
import { useNavigate } from 'react-router-dom'

const courses = [
  { icon: TbDeviceDesktopAnalytics, label: 'Web Development', iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  { icon: LiaUikit,                  label: 'UI / UX Design',  iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { icon: MdAppShortcut,             label: 'App Development', iconBg: 'bg-sky-100',    iconColor: 'text-sky-600'    },
  { icon: FaHackerrank,              label: 'Ethical Hacking', iconBg: 'bg-blue-100',   iconColor: 'text-blue-700'   },
  { icon: TbBrandOpenai,             label: 'AI / ML',         iconBg: 'bg-cyan-100',   iconColor: 'text-cyan-600'   },
  { icon: SiGoogledataproc,          label: 'Data Science',    iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
  { icon: BsClipboardDataFill,       label: 'Data Analytics',  iconBg: 'bg-sky-100',    iconColor: 'text-sky-700'    },
  { icon: SiOpenaigym,               label: 'AI Tools',        iconBg: 'bg-blue-100',   iconColor: 'text-blue-500'   },
]

function ExploreCourses() {
  const navigate = useNavigate()

  return (
    <section className="w-full bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-500 mb-3">
              — What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Explore <br />
              <span className="text-blue-600">Our Courses</span>
            </h2>
          </div>

          <div className="lg:max-w-xs">
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Dive into industry-relevant programs designed by world-class experts to accelerate your professional growth.
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Explore All Courses
              <SiViaplay className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courses.map(({ icon: Icon, label, iconBg, iconColor }) => (
            <div
              key={label}
              className="group cursor-pointer flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <span className="text-slate-600 group-hover:text-blue-700 text-sm font-semibold text-center leading-tight transition-colors duration-200">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ExploreCourses
