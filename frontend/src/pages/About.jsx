import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import about from '../assets/about.jpg'
import {
  FaUsers, FaBookOpen, FaStar, FaChalkboardTeacher,
  FaAward, FaGlobe, FaRocket, FaShieldAlt,
  FaLinkedin, FaTwitter, FaGithub
} from 'react-icons/fa'
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineHeart } from 'react-icons/hi2'
import { BiSolidBadgeCheck } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '50K+',  label: 'Active Students',  icon: FaUsers,             bg: 'bg-blue-600'   },
  { value: '200+',  label: 'Expert Courses',    icon: FaBookOpen,          bg: 'bg-indigo-500' },
  { value: '40+',   label: 'Instructors',       icon: FaChalkboardTeacher, bg: 'bg-sky-500'    },
  { value: '98%',   label: 'Satisfaction Rate', icon: FaStar,              bg: 'bg-amber-400'  },
]

const values = [
  {
    icon: HiOutlineLightBulb,
    title: 'Innovation First',
    desc: 'We constantly evolve our platform with cutting-edge technology to deliver the best learning experience.',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: FaGlobe,
    title: 'Global Community',
    desc: 'Connect with learners and experts from over 150 countries in a vibrant, supportive community.',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: HiOutlineHeart,
    title: 'Student Focused',
    desc: 'Every decision we make is centered around delivering the maximum value to our students.',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    icon: FaShieldAlt,
    title: 'Quality Assured',
    desc: 'All courses are reviewed and certified by industry experts before being published on our platform.',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: FaRocket,
    title: 'Career Growth',
    desc: 'Our courses are designed to directly accelerate your career with practical, job-ready skills.',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: FaAward,
    title: 'Certified Learning',
    desc: 'Earn industry-recognized certificates that employers trust and value worldwide.',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
]

const milestones = [
  { year: '2018', title: 'Founded',           desc: 'Started with a vision to make quality education accessible to all.' },
  { year: '2019', title: 'First 1K Students', desc: 'Reached our first milestone of 1,000 enrolled learners.' },
  { year: '2021', title: 'Global Expansion',  desc: 'Expanded to 50+ countries with multilingual course support.' },
  { year: '2023', title: '50K Community',     desc: 'Built a thriving global community of 50,000+ active learners.' },
]

function AboutPage() {
  const navigate = useNavigate()

  const [instructors, setInstructors] = useState([])
  const [loadingInstructors, setLoadingInstructors] = useState(true)
  const [instructorError, setInstructorError] = useState(null)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoadingInstructors(true)
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${BASE_URL}/api/user/instructors`, {
          credentials: 'include',
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || `Server error: ${res.status}`)
        }
        const data = await res.json()
        setInstructors(data.instructors || data)
      } catch (err) {
        console.error('Instructor fetch error:', err)
        setInstructorError(err.message)
      } finally {
        setLoadingInstructors(false)
      }
    }
    fetchInstructors()
  }, [])

  return (
    <div className="w-full overflow-hidden bg-white">
      <Nav />

      {/* ── HERO ── */}
      <section className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 pt-24 pb-32 px-6 relative overflow-hidden">
        {/* dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-600 text-blue-200 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <HiOutlineAcademicCap className="w-4 h-4" />
            About Virtual Courses
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            We Are On A Mission To <br />
            <span className="text-blue-300">Transform Learning</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Virtual Courses is a world-class online learning platform that empowers students and professionals to grow their skills, advance their careers, and unlock new opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/allcourses')}
              className="bg-white hover:bg-blue-50 text-blue-700 font-black text-sm px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-2xl"
            >
              Explore Courses
            </button>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-16">
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full fill-white">
            <path d="M0,64 C360,16 1080,16 1440,64 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="w-full bg-white py-16 px-6 -mt-2">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon, bg }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-black text-slate-900">{value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest text-center">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="w-full bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Image */}
          <div className="lg:w-5/12 w-full relative flex-shrink-0">
            <div className="absolute inset-6 bg-blue-100 rounded-3xl rotate-3" />
            <div className="relative z-10 w-full max-w-md mx-auto">
              <img src={about} alt="About us" className="w-full rounded-3xl shadow-2xl border-4 border-white object-cover" />
              <div className="absolute -bottom-5 -right-4 bg-blue-600 text-white font-black px-5 py-3 rounded-2xl shadow-xl">
                <span className="text-2xl font-black block">10+</span>
                <span className="text-xs font-bold uppercase tracking-wider">Years of Excellence</span>
              </div>
              <div className="absolute -top-4 -left-4 bg-white border border-blue-100 text-slate-700 text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-blue-500" />
                <span>Since 2018</span>
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="lg:w-7/12 w-full">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-500 block mb-4">— Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
              Built By Learners, <br />
              <span className="text-blue-600">For Learners</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-5">
              Virtual Courses was founded in 2018 by a group of educators and technologists who believed that quality education should be accessible to everyone — regardless of location, background, or budget.
            </p>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              What started as a small platform with 10 courses has grown into a global learning community of 50,000+ students, 200+ expert-led courses, and partnerships with top industry leaders across technology, design, and business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Lifetime access to all courses',
                'Industry-recognized certificates',
                'Expert instructors worldwide',
                'Personalized learning paths',
                'Live sessions & recordings',
                'Community support forums',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <BiSolidBadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-600 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-500 block mb-4">— Our Values</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              What Drives <span className="text-blue-600">Everything We Do</span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              These core principles guide every course, feature, and decision we make at Virtual Courses.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div key={title} className="group flex flex-col gap-4 p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-black text-slate-900">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="w-full bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-500 block mb-4">— Our Journey</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Milestones That <span className="text-blue-600">Define Us</span>
            </h2>
          </div>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="flex flex-col gap-12">
              {milestones.map(({ year, title, desc }, i) => (
                <div key={year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 max-w-xs ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                      <h3 className="text-base font-black text-slate-900 mb-1">{title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                  {/* dot */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-white text-xs font-black">{year}</span>
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTRUCTORS ── */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-500 block mb-4">— Meet The Experts</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              Learn From The <span className="text-blue-600">Best Instructors</span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Our instructors are industry professionals with years of real-world experience, passionate about sharing their knowledge.
            </p>
          </div>

          {/* Loading state */}
          {loadingInstructors && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-slate-100 bg-white animate-pulse">
                  <div className="w-24 h-24 rounded-2xl bg-slate-200" />
                  <div className="w-28 h-4 rounded bg-slate-200" />
                  <div className="w-20 h-3 rounded bg-slate-100" />
                  <div className="w-full h-8 rounded bg-slate-100 mt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {instructorError && !loadingInstructors && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-slate-500 text-base">Could not load instructors. Please try again later.</p>
            </div>
          )}

          {/* Instructors grid */}
          {!loadingInstructors && !instructorError && instructors.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-base">No instructors found.</p>
            </div>
          )}

          {!loadingInstructors && !instructorError && instructors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((instructor) => (
                <div key={instructor._id} className="group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">

                  {/* Avatar */}
                  <div className="relative">
                    {instructor.photoUrl ? (
                      <img
                        src={instructor.photoUrl}
                        alt={instructor.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white ring-2 ring-slate-100 group-hover:ring-blue-300 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-4 border-white ring-2 ring-slate-100 group-hover:ring-blue-300 transition-all duration-300">
                        <span className="text-white text-2xl font-black">
                          {instructor.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <BiSolidBadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-base font-black text-slate-900">{instructor.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-1">
                      {instructor.description || 'Expert Instructor'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="w-full flex justify-between items-center px-2 pt-2 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-xs font-black text-slate-800">
                        {instructor.courseCount ?? instructor.courses?.length ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Courses</div>
                    </div>
                    <div className="w-px h-6 bg-slate-100" />
                    <div className="text-center">
                      <div className="text-xs font-black text-slate-800">
                        {instructor.studentCount ?? instructor.enrolledStudents ?? '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Students</div>
                    </div>
                    <div className="w-px h-6 bg-slate-100" />
                    <div className="text-center flex flex-col items-center">
                      <div className="text-xs font-black text-amber-500">
                        ★ {instructor.rating ?? '4.5'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Rating</div>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="w-full bg-blue-600 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            Ready to Start Your <br />Learning Journey?
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Join 50,000+ learners already growing their skills on Virtual Courses. Your first course is just one click away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/allcourses')}
              className="bg-white hover:bg-blue-50 text-blue-700 font-black text-sm px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-2xl"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage