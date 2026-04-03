import React from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.jpg"

const quickLinks = [
  { label: 'Home',       path: '/'           },
  { label: 'All Courses', path: '/allcourses' },
  { label: 'Login',      path: '/login'      },
  { label: 'My Profile', path: '/profile'    },
]

const categories = [
  'Web Development',
  'AI / ML',
  'Data Science',
  'UI/UX Design',
  'App Development',
  'Ethical Hacking',
]

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-black pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Logo"
                className="h-9 w-9 rounded-lg object-cover border-2 border-gray-700"
              />
              <span className="text-xl font-black text-white tracking-tight">Virtual Courses</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Online learning platform to help you grow smarter.
              Learn anything, anytime, anywhere — at your own pace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="group text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="block w-0 group-hover:w-3 h-0.5 bg-white rounded transition-all duration-200" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-5">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <span className="group text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer flex items-center gap-2">
                    <span className="block w-0 group-hover:w-3 h-0.5 bg-white rounded transition-all duration-200" />
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()}{' '}
            <span className="text-white font-bold">Virtual Courses</span>.
            {' '}All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-xs">
            <span className="hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors duration-200">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors duration-200">Contact Us</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
