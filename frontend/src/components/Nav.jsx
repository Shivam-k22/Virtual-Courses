import React, { useState, useRef, useEffect } from 'react'
import logo from "../assets/logo.jpg"
import { IoMdPerson } from "react-icons/io"
import { useNavigate, useLocation } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'


function Nav() {
  const [showHam, setShowHam] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()
const location = useLocation()
const dispatch = useDispatch()
const { userData } = useSelector(state => state.user)
const dropdownRef = useRef(null)

/* ── Close dropdowns on outside click ── */
useEffect(() => {
  const handler = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowPro(false)
    }
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [])


  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      await dispatch(setUserData(null))
      toast.success("Logged out successfully")
      setShowPro(false)
      setShowHam(false)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  /* ── Search: pass query + category to AllCourses ── */
  const handleSearch = (e) => {
  e.preventDefault()

  navigate("/allcourses", {
    state: {
      query: searchQuery.trim()
    }
  })

  setSearchQuery("")
  setShowHam(false)
}

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    ...(userData ? [{ label: 'My Courses', path: '/enrolledcourses' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav className="w-full h-[68px] fixed top-0 left-0 z-50 flex items-center justify-between px-6 lg:px-12 bg-white border-b border-gray-200 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="VC"
            className="w-[40px] h-[40px] rounded-[10px] object-contain bg-black border border-white/20 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="hidden sm:block text-[22px] font-bold text-gray-900 tracking-tight">
            Virtual <span className="text-blue-500">Courses</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative px-4 py-2 text-[16px] font-medium rounded-lg transition-all duration-150
                ${isActive(path)
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {label}
              {isActive(path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Search bar with category dropdown ── */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-[600px] mx-4">
  <div className="flex items-center w-full h-[44px] border-[1.5px] border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-100 transition-all">

    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search courses (e.g. Web Development, React...)"
      className="flex-1 h-full px-5 bg-transparent outline-none text-[14px] text-gray-800 placeholder-gray-400"
    />

    <button
      type="submit"
      className="h-full px-5 bg-gray-900 hover:bg-blue-600 flex items-center justify-center transition-colors"
    >
      <svg className="w-[17px] h-[17px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>

  </div>
</form>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2.5">

          {/* Educator Dashboard Button */}
          {userData?.role === "educator" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </button>
          )}

          {/* Admin Dashboard Button - Same style as educator button */}
          {userData?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Admin Panel
            </button>
          )}

          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowPro(prev => !prev)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-blue-600 text-white font-semibold text-[13px] flex-shrink-0">
                  {userData.photoUrl
                    ? <img src={userData.photoUrl} className="w-full h-full object-cover" alt="" />
                    : userData?.name?.slice(0, 1).toUpperCase()
                  }
                </div>
                <span className="text-[15px] font-medium text-gray-700 group-hover:text-gray-900 max-w-[100px] truncate">
                  {userData.name?.split(' ')[0]}
                </span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showPro ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showPro && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-[15px] font-semibold text-gray-900 truncate">{userData.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{userData.email}</p>
                  </div>
                  
                  {/* Admin Panel link in dropdown */}
                  {userData?.role === "admin" && (
                    <>
                      <button onClick={() => { navigate("/admin/dashboard"); setShowPro(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Admin Panel
                      </button>
                      <div className="mx-3 my-1.5 h-px bg-gray-100" />
                    </>
                  )}
                  
                  {/* Educator Dashboard link in dropdown */}
                  {userData?.role === "educator" && (
                    <>
                      <button onClick={() => { navigate("/dashboard"); setShowPro(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                      </button>
                      <div className="mx-3 my-1.5 h-px bg-gray-100" />
                    </>
                  )}
                  
                  <button onClick={() => { navigate("/profile"); setShowPro(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                    My Profile
                  </button>
                  <button onClick={() => { navigate("/enrolledcourses"); setShowPro(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    My Courses
                  </button>
                  <div className="mx-3 my-1.5 h-px bg-gray-100" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/login")}
                className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors">
                <IoMdPerson className="w-5 h-5 text-gray-500" />
              </button>
              <button onClick={() => navigate("/login")}
                className="px-4 py-2 text-[15px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                Log In
              </button>
              <button onClick={() => navigate("/signup")}
                className="px-4 py-2 text-[15px] font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all shadow-sm shadow-blue-900/50">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setShowHam(true)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      {showHam && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setShowHam(false)} />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`fixed top-0 right-0 h-full w-[300px] z-50 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${showHam ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-5 h-[68px] border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="VC" className="w-[34px] h-[34px] rounded-lg object-contain bg-black border border-white/20" />
            <span className="text-[15px] font-bold text-gray-900">Virtual <span className="text-blue-500">Courses</span></span>
          </div>
          <button onClick={() => setShowHam(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User card */}
        {userData ? (
          <div className="mx-4 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
            <div className="w-[44px] h-[44px] rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-blue-600 text-white font-bold text-lg flex-shrink-0">
              {userData.photoUrl ? <img src={userData.photoUrl} className="w-full h-full object-cover" alt="" /> : userData?.name?.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 truncate">{userData.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{userData.email}</p>
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-4 flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="w-[44px] h-[44px] rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
              <IoMdPerson className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex gap-2 flex-1">
              <button onClick={() => { navigate("/login"); setShowHam(false) }}
                className="flex-1 py-2 text-[13px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                Log In
              </button>
              <button onClick={() => { navigate("/signup"); setShowHam(false) }}
                className="flex-1 py-2 text-[13px] font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Mobile Search with category select */}
        <form onSubmit={handleSearch} className="mx-4 mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-400">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder-gray-400"
            />
            <button type="submit"
              className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-4 mt-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">Navigation</p>
          {navLinks.map(({ label, path }) => (
            <button key={path} onClick={() => { navigate(path); setShowHam(false) }}
              className={`w-full flex items-center justify-between px-3 py-3 text-[14px] font-medium rounded-xl mb-0.5 transition-all
                ${isActive(path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              {label}
              {isActive(path) && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </button>
          ))}

          {userData && (
            <>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-2 mt-5 mb-2">Account</p>
              
              {/* Admin Panel link in mobile menu */}
              {userData?.role === "admin" && (
                <button onClick={() => { navigate("/admin/dashboard"); setShowHam(false) }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all mb-0.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  Admin Panel
                </button>
              )}
              
              <button onClick={() => { navigate("/profile"); setShowHam(false) }}
                className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                </div>
                My Profile
              </button>
              <button onClick={() => { navigate("/enrolledcourses"); setShowHam(false) }}
                className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /></svg>
                </div>
                My Courses
              </button>
              {userData?.role === "educator" && (
                <button onClick={() => { navigate("/dashboard"); setShowHam(false) }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all mb-0.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                  </div>
                  Dashboard
                </button>
              )}
              <div className="mx-2 my-3 h-px bg-gray-100" />
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                </div>
                Log Out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="h-[68px]" />
    </>
  )
}

export default Nav