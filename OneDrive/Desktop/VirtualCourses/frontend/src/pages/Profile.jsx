import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  let { userData } = useSelector(state => state.user)
  let navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">

      <div className="relative w-full max-w-xl">

        {/* Glow Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10">

          {/* Back Button */}
          <FaArrowLeftLong
            className='absolute top-6 left-6 w-5 h-5 cursor-pointer text-gray-500 hover:text-black transition'
            onClick={() => navigate("/")}
          />

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4">

            <div className="relative group">
              {userData.photoUrl ? (
                <img
                  src={userData?.photoUrl}
                  alt=""
                  className="w-28 h-28 rounded-full object-cover border-[3px] border-gray-900 shadow-lg transition group-hover:scale-105"
                />
              ) : (
                <div className='w-28 h-28 rounded-full flex items-center justify-center text-3xl text-white bg-gray-900 shadow-lg'>
                  {userData?.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {userData.name}
            </h2>

            <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {userData.role}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Info */}
          <div className="space-y-5 text-sm">

            {/* Email */}
            <div className="flex justify-between items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
              <span className="font-medium text-gray-700">Email</span>
              <span className="text-gray-900 break-all">{userData.email}</span>
            </div>

            {/* Bio */}
            <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
              <span className="font-medium text-gray-700 block mb-1">Bio</span>
              <span className="text-gray-800">
                {userData.description || "No description added"}
              </span>
            </div>

            {/* Enrolled Courses */}
            <div className="flex justify-between items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
              <span className="font-medium text-gray-700">Enrolled Courses</span>
              <span className="text-gray-900 font-semibold">
                {userData.enrolledCourses.length}
              </span>
            </div>

          </div>

          {/* Button */}
          <div className="mt-8">
            <button
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold tracking-wide 
              hover:bg-black active:scale-[0.97] transition-all shadow-md"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile