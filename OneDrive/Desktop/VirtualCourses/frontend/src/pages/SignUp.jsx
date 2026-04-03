import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.png'
import registerImg from '../assets/register.svg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      toast.success("SignUp Successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed")
    }
    setLoading(false)
  }

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      const result = await axios.post(serverUrl + "/api/auth/googlesignup",
        { name: user.displayName, email: user.email, role },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
      navigate("/")
      toast.success("SignUp Successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Google signup failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-contacts-auto-fill-button,
        input[type="password"]::-webkit-credentials-auto-fill-button { display: none !important; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-6 items-center">

        {/* LEFT: form card — same size as Login */}
        <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-md mx-auto">

          <h2 className="text-2xl font-bold text-gray-800 mb-0.5 text-center">
            Create Account 🎓
          </h2>
          <p className="text-gray-500 text-center text-base mb-4">
            Sign up to get started
          </p>

          {/* Full Name */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-base"
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-base"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center mt-0.5 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400 bg-white">
              <input
                type={show ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="flex-1 px-3 py-1.5 outline-none bg-transparent text-base rounded-md [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                style={{ WebkitTextSecurity: show ? 'none' : undefined }}
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
              <span
                className="px-3 flex items-center cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                onClick={() => setShow(p => !p)}
              >
                {show ? <MdRemoveRedEye size={18} /> : <MdOutlineRemoveRedEye size={18} />}
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="mb-2.5">
            <label className="text-sm text-gray-600 block mb-1">I am a</label>
            <div className="flex gap-6 justify-start">
              {[["student", "Student"], ["educator", "Educator"]].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setRole(val)}
                  className={`w-28 py-1 rounded-md border text-sm font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer
                    ${role === val
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${role === val ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up button */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition flex items-center justify-center text-base"
            disabled={loading}
            onClick={handleSignUp}
          >
            {loading ? <ClipLoader size={16} color="white" /> : "Sign Up"}
          </button>

          {/* Forgot */}
          <p
            className="text-sm text-center text-gray-500 mt-2 cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot your password?
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <div className="mt-2">
            <button
              onClick={googleSignUp}
              className="w-full border border-gray-300 py-1.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <img src={google} alt="Google" className="w-4" />
              <span className="text-gray-600 font-medium text-sm">Continue with Google</span>
            </button>
          </div>

          {/* Login link */}
          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>

        </div>

        {/* RIGHT: brand + illustration — same as Login right side */}
        <div className="hidden md:flex flex-col justify-center items-center text-center px-6">

          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={logo}
              alt="Virtual Courses"
              className="w-[64px] h-[64px] rounded-2xl object-contain bg-black"
            />
            <h1 className="text-4xl font-bold text-gray-800">
              Virtual Courses
            </h1>
          </div>

          <p className="text-gray-500 text-2xl mb-1">Learn anytime, anywhere.</p>
          <p className="text-gray-500 text-2xl mb-5">Build your future with our LMS platform.</p>

          <img
            src={registerImg}
            alt="Register illustration"
            className="w-full max-w-2xl"
          />

        </div>

      </div>
    </div>
  )
}

export default SignUp