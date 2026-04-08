import React, { useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";

function Courses() {

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const { creatorCourseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message)
      }
    }
    getCreatorData()
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-50">

      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
          >
            <FaArrowLeftLong className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-2">Creator Studio</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Courses</h1>
              <p className="text-gray-400 text-sm mt-2">Manage, publish and track all your created courses.</p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {creatorCourseData?.length > 0 && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3">
                  <span className="text-2xl font-bold text-white">{creatorCourseData.length}</span>
                  <span className="text-gray-400 text-sm">{creatorCourseData.length === 1 ? "Course" : "Courses"}</span>
                </div>
              )}
              <button
                onClick={() => navigate("/createcourses")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                + Create Course
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Empty State */}
        {creatorCourseData?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <span className="text-4xl">🎓</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">No courses yet</h3>
            <p className="text-gray-400 text-sm text-center max-w-xs">
              You haven't created any course yet. Start building your first course today!
            </p>
            <button
              onClick={() => navigate("/createcourses")}
              className="mt-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
            >
              + Create Course
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}
        {creatorCourseData?.length > 0 && (
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500">
                  <th className="text-left py-4 px-6 font-semibold text-xs tracking-widest uppercase">Course</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs tracking-widest uppercase">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs tracking-widest uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs tracking-widest uppercase">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {creatorCourseData?.map((course, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-blue-50/40 transition duration-200"
                  >
                    {/* Course */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={course?.thumbnail || img1}
                          alt=""
                          className="w-20 h-12 object-cover rounded-xl border border-gray-100 group-hover:border-blue-200 transition shrink-0"
                        />
                        <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition line-clamp-2 max-w-[260px]">
                          {course?.title}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-semibold">
                        {course?.price ? `₹${course.price}` : <span className="text-gray-300">—</span>}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {course?.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => navigate(`/addcourses/${course?._id}`)}
                        className="flex items-center gap-2 group/btn"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 group-hover/btn:bg-blue-600 group-hover/btn:text-white group-hover/btn:border-blue-600 transition-all duration-200">
                          <FaEdit className="text-sm" />
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            <div className="border-t border-gray-50 bg-gray-50/60 px-6 py-3">
              <p className="text-xs text-gray-400">
                Showing {creatorCourseData?.length} course{creatorCourseData?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* MOBILE VIEW */}
        {creatorCourseData?.length > 0 && (
          <div className="md:hidden space-y-4">
            {creatorCourseData?.map((course, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Thumbnail strip */}
                <div className="relative w-full h-36 bg-gray-100 overflow-hidden">
                  <img
                    src={course?.thumbnail || img1}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  {/* Status badge on image */}
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full
                    ${course?.isPublished
                      ? "bg-green-500/90 text-white"
                      : "bg-amber-400/90 text-white"}`}>
                    {course?.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {course?.title}
                  </h2>

                  <p className="text-blue-600 text-xs font-semibold">
                    {course?.price ? `₹${course.price}` : <span className="text-gray-300">No price set</span>}
                  </p>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => navigate(`/addcourses/${course?._id}`)}
                    className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FaEdit className="text-xs" />
                    Edit Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Courses