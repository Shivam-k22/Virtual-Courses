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
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
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