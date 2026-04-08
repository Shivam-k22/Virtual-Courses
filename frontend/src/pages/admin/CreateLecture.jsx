import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [lectureTitle, setLectureTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { lectureData } = useSelector(state => state.lecture)

  const createLectureHandler = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      )

      dispatch(setLectureData([...lectureData, result.data.lecture]))
      toast.success("Lecture Created")
      setLectureTitle("")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(
          serverUrl + `/api/course/getcourselecture/${courseId}`,
          { withCredentials: true }
        )
        dispatch(setLectureData(result.data.lectures))
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
    }
    getLecture()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">

      <div className="relative w-full max-w-2xl">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Add Lectures
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage lectures for your course
            </p>
          </div>

          {/* Input */}
          <div className="mb-5">
            <label className="text-base font-semibold text-gray-800">
              Lecture Title
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to MERN Stack"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* Back */}
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
              bg-gray-200 hover:bg-gray-300 transition-all duration-200"
              onClick={() => navigate(`/addcourses/${courseId}`)}
            >
              <FaArrowLeft />
              Back
            </button>

            {/* Create */}
            <button
              className="px-5 py-2 rounded-xl bg-gray-900 text-white 
              hover:bg-black hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg 
              flex items-center justify-center"
              disabled={loading}
              onClick={createLectureHandler}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "+ Create Lecture"}
            </button>

          </div>

          {/* Lecture List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">

            {lectureData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm">
                No lectures added yet
              </p>
            ) : (
              lectureData.map((lecture, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 rounded-xl 
                  bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Lecture {index + 1}: {lecture.lectureTitle}
                  </span>

                  <FaEdit
                    className="text-gray-500 hover:text-black cursor-pointer transition"
                    onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                  />
                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateLecture