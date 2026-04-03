import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.png'
import hrImage from '../assets/HR.svg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Login() {
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const navigate = useNavigate()
    let [show,setShow] = useState(false)
     const [loading,setLoading]= useState(false)
     let dispatch = useDispatch()
    const handleLogin = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/login" , {email , password} ,{withCredentials:true})
            dispatch(setUserData(result.data))
            navigate("/")
            setLoading(false)
            toast.success("Login Successfully")
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }
        
    }
     const googleLogin = async () => {
            try {
                const response = await signInWithPopup(auth,provider)
                
                let user = response.user
                let name = user.displayName;
                let email=user.email
                let role=""
                
                
                const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email , role}
                    , {withCredentials:true}
                )
                dispatch(setUserData(result.data))
                navigate("/")
                toast.success("Login Successfully")
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            }
            
        }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-contacts-auto-fill-button,
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-textfield-decoration-container,
        input[type="password"]::-webkit-caps-lock-indicator,
        input[type="password"]::-webkit-strong-password-auto-fill-button { display: none !important; visibility: hidden !important; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type="password"] { -webkit-appearance: none; appearance: none; }
      `}</style>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-6 items-center">

        {/* LEFT LOGIN */}
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto">

          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Login to your account
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 bg-white">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="flex-1 px-4 py-3 outline-none bg-transparent rounded-lg"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <span
                className="px-3 flex items-center cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                onClick={() => setShow(p => !p)}
              >
                {show ? <MdRemoveRedEye size={20} /> : <MdOutlineRemoveRedEye size={20} />}
              </span>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>

          {/* FORGOT PASSWORD */}
          <p
            className="text-sm text-center text-gray-500 mt-4 cursor-pointer hover:text-blue-500"
            onClick={()=>navigate("/forgotpassword")}
          >
            Forgot your password?
          </p>

          {/* GOOGLE LOGIN (only one clean section) */}
          <div className="mt-6">
            <button
              onClick={googleLogin}
              className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img src={google} className="w-5" />
              <span className="text-gray-600 font-medium">Continue with Google</span>
            </button>
          </div>

          {/* SIGNUP */}
          <p className="text-sm text-center text-gray-600 mt-5">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={()=>navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex flex-col justify-center items-center text-center px-6">

          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={logo}
              alt="Virtual Courses"
              className="w-[64px] h-[64px] rounded-xl object-contain bg-black"
            />
            <h1 className="text-4xl font-bold text-gray-800">
              Virtual Courses
            </h1>
          </div>

          <p className="text-gray-500 text-2xl mb-1">Learn anytime, anywhere.</p>
          <p className="text-gray-500 text-2xl mb-5">Build your future with our LMS platform.</p>

          <img
            src={hrImage}
            alt="Learning"
            className="w-full max-w-2xl"
          />
        </div>

      </div>
    </div>
  )
}

export default Login