import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const CreateCourse = () => {
  let navigate = useNavigate()
  let [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const CreateCourseHandler = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      )

      toast.success("Course Created")
      navigate("/dashboard")
      setTitle("")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">

      <div className="relative w-full max-w-xl">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-8">

          {/* Header */}
          <div className="flex items-center justify-center mb-6 relative">
            <FaArrowLeftLong
              className="absolute left-0 top-1 w-5 h-5 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => navigate("/dashboard")}
            />

            <h2 className="text-2xl font-bold text-gray-900">
              Create Course
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {/* Title */}
            <div>
              <label className="text-base font-semibold text-gray-800">
                Course Title
              </label>
              <input
                type="text"
                placeholder="Enter course title"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-base font-semibold text-gray-800">
                Category
              </label>
              <select
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Select category</option>

                <optgroup label="Technology">
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Database Management">Database Management</option>
                </optgroup>

                <optgroup label="Programming">
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C / C++">C / C++</option>
                  <option value="DSA">DSA</option>
                </optgroup>

                <optgroup label="Design">
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="3D Modeling">3D Modeling</option>
                </optgroup>

                <optgroup label="Business">
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Project Management">Project Management</option>
                  <option value="HR & Leadership">HR & Leadership</option>
                </optgroup>

                <optgroup label="Other">
                  <option value="Personal Development">Personal Development</option>
                  <option value="Language Learning">Language Learning</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Photography">Photography</option>
                  <option value="Music">Music</option>
                </optgroup>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-xl 
              hover:bg-black hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg 
              flex items-center justify-center"
              disabled={loading}
              onClick={CreateCourseHandler}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Create Course"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCourse