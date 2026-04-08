import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'

function ForgotPassword() {
    let navigate = useNavigate()
    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [loading,setLoading]= useState(false)
    const [newpassword,setNewPassword]= useState("")
    const [conPassword,setConpassword]= useState("")

   const handleStep1 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp` , {email} , {withCredentials:true})
      setStep(2)
      toast.success(result.data.message)
      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
   }

   const handleStep2 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp` , {email,otp} , {withCredentials:true})
      toast.success(result.data.message)
      setLoading(false)
      setStep(3)
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
   }

   const handleStep3 = async () => {
    setLoading(true)
    try {
      if(newpassword !== conPassword){
        return toast.error("Password does not match")
      }
      const result = await axios.post(`${serverUrl}/api/auth/resetpassword` , {email,password:newpassword} , {withCredentials:true})
      toast.success(result.data.message)
      setLoading(false)
      navigate("/login")
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">

      {/* STEP 1 */}
      { step==1 && 
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Your Password?
        </h2>

        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enter your email
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition 
            text-white py-2 rounded-md font-medium shadow-md"
            disabled={loading}
            onClick={handleStep1}
          >
            {loading?<ClipLoader size={25} color='white'/>:"Send OTP"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-500 hover:text-black cursor-pointer"
          onClick={()=>navigate("/login")}>
          Back to Login
        </div>
      </div>}

      {/* STEP 2 */}
      {step==2 && 
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>

        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enter OTP sent to email
            </label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter OTP"
              onChange={(e)=>setOtp(e.target.value)}
              value={otp}
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition 
            text-white py-2 rounded-md font-medium shadow-md"
            disabled={loading}
            onClick={handleStep2}
          >
            {loading?<ClipLoader size={25} color='white'/>:"Verify OTP"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-500 hover:text-black cursor-pointer"
          onClick={()=>navigate("/login")}>
          Back to Login
        </div>
      </div>}

      {/* STEP 3 */}
      {step==3 &&   
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter a new password
        </p>

        <form className="space-y-5">

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password"
              onChange={(e)=>setNewPassword(e.target.value)}
              value={newpassword}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 rounded-md border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Re-enter password"
              onChange={(e)=>setConpassword(e.target.value)}
              value={conPassword}
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition 
            text-white py-2 rounded-md font-medium shadow-md"
            disabled={loading}
            onClick={handleStep3}
          >
            {loading?<ClipLoader size={25} color='white'/>:"Reset Password"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-500 hover:text-black cursor-pointer"
          onClick={()=>navigate("/login")}>
          Back to Login
        </div>
      </div>}
    </div>
  )
}

export default ForgotPassword
