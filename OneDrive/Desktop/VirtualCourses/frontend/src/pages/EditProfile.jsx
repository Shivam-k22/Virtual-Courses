import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
  let { userData } = useSelector(state => state.user)
  let [name, setName] = useState(userData.name || "")
  let [description, setDescription] = useState(userData.description || "")
  let [photoUrl, setPhotoUrl] = useState(null)
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let navigate = useNavigate()

  const formData = new FormData()
  formData.append("name", name)
  formData.append("description", description)
  formData.append("photoUrl", photoUrl)

  const updateProfile = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      setLoading(false)
      toast.success("Profile Update Successfully")
    } catch (error) {
      console.log(error)
      toast.error("Profile Update Error")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">

      <div className="relative w-full max-w-xl">

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10">

          {/* Back */}
          <FaArrowLeftLong
            className='absolute top-6 left-6 w-5 h-5 cursor-pointer text-gray-500 hover:text-black transition'
            onClick={() => navigate("/profile")}
          />

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight">
            Edit Profile
          </h2>

          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
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

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                  Change
                </div>
              </div>

              <input
                type="file"
                name="photoUrl"
                className="text-xs text-gray-600 
                file:mr-4 file:py-2 file:px-5 
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold 
                file:bg-gray-900 file:text-white 
                hover:file:bg-gray-700 
                cursor-pointer transition"
                onChange={(e) => setPhotoUrl(e.target.files[0])}
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                placeholder={userData.name}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder={userData.email}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={updateProfile}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold tracking-wide 
              hover:bg-black active:scale-[0.97] transition-all flex items-center justify-center shadow-md"
            >
              {loading ? <ClipLoader size={24} color='white' /> : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile