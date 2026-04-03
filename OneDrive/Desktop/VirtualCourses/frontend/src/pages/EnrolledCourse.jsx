import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";

function EnrolledCourse() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (userData?.enrolledCourses?.length > 0) {
      fetchCourses();
    }
  }, [userData]);

  const fetchCourses = async () => {
  try {
    const res = await axios.get(
      `${serverUrl}/api/course/enrolled-courses`,
      {
        withCredentials: true   // ✅ VERY IMPORTANT
      }
    );

    setCourses(res.data);  // ✅ FIXED

  } catch (error) {
    console.log("Error fetching enrolled courses:", error);

    if (error.response?.status === 401) {
      navigate("/login");
    }
  }
};

  return (
    <div className="min-h-screen w-full bg-gray-50">

      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
          >
            <FaArrowLeftLong className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-2">Learning Dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">My Enrolled Courses</h1>
              <p className="text-gray-400 text-sm mt-2">Continue where you left off and keep growing.</p>
            </div>
            {courses.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 self-start sm:self-auto">
                <span className="text-2xl font-bold text-white">{courses.length}</span>
                <span className="text-gray-400 text-sm">{courses.length === 1 ? "Course" : "Courses"} Enrolled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Empty State */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">No courses yet</h3>
            <p className="text-gray-400 text-sm text-center max-w-xs">You haven't enrolled in any course yet. Start learning something new today!</p>
            <button
              onClick={() => navigate("/allcourses")}
              className="mt-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/300"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full capitalize shadow-sm">
                    {course.category || "Category"}
                  </span>

                  {/* Course number */}
                  <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold w-7 h-7 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>

                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5 flex flex-col gap-2">

                  {/* Title */}
                  <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {course.title}
                  </h2>

                  {/* Subtitle */}
                  {course.subTitle && (
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {course.subTitle}
                    </p>
                  )}

                  {/* Level badge */}
                  <span className="self-start text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {course.level || "Beginner"}
                  </span>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Watch Button */}
                  <button
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourse;