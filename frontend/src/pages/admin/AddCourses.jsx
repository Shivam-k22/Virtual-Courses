import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';

function AddCourses() {
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  const thumb = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  let [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const { courseData } = useSelector(state => state.course)

  const getCourseById = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
      setSelectedCourse(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])

  useEffect(() => {
    getCourseById()
  }, [])

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const editCourseHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("thumbnail", backendImage);
    formData.append("isPublished", isPublished);

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );

      const updatedCourse = result.data;
      if (updatedCourse.isPublished) {
        const updatedCourses = courseData.map(c =>
          c._id === courseId ? updatedCourse : c
        );
        if (!courseData.some(c => c._id === courseId)) {
          updatedCourses.push(updatedCourse);
        }
        dispatch(setCourseData(updatedCourses));
      } else {
        const filteredCourses = courseData.filter(c => c._id !== courseId);
        dispatch(setCourseData(filteredCourses));
      }

      navigate("/courses");
      toast.success("Course Updated");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async () => {
    setLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
      toast.success("Course Deleted")
      const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
      navigate("/courses")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">

      <div className="relative w-full max-w-5xl">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative">
            <FaArrowLeftLong
              className='absolute left-0 top-1 w-5 h-5 cursor-pointer text-gray-500 hover:text-black'
              onClick={() => navigate("/courses")}
            />

            <h2 className="text-2xl font-bold text-gray-900 w-full text-center">
              Edit Course
            </h2>

            <button
              className="bg-gray-900 text-white px-5 py-2 rounded-xl 
              hover:bg-black hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}
            >
              Lectures
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              className={`px-4 py-2 rounded-xl border text-sm font-medium 
              transition-all duration-200
              ${isPublished 
                ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200 hover:scale-105" 
                : "bg-green-100 text-green-600 border-green-200 hover:bg-green-200 hover:scale-105"
              }`}
              onClick={() => setIsPublished(prev => !prev)}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded-xl 
              hover:bg-red-700 hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
              onClick={removeCourse}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Delete"}
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            <div>
              <label className="text-base font-semibold text-gray-800">Title</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>

            <div>
              <label className="text-base font-semibold text-gray-800">Subtitle</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                onChange={(e) => setSubTitle(e.target.value)}
                value={subTitle}
              />
            </div>

            <div>
              <label className="text-base font-semibold text-gray-800">Description</label>
              <textarea
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 h-28 resize-none"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <label className="text-base font-semibold text-gray-800">Category</label>
                <select
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select</option>
                  <optgroup label="Technology">
                    <option>Web Development</option>
                    <option>Mobile App Development</option>
                    <option>AI/ML</option>
                    <option>Data Science</option>
                    <option>Cloud Computing</option>
                    <option>DevOps</option>
                    <option>Cybersecurity</option>
                    <option>Blockchain</option>
                    <option>Game Development</option>
                    <option>Database Management</option>
                  </optgroup>
                  <optgroup label="Programming">
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>Java</option>
                    <option>C / C++</option>
                    <option>DSA</option>
                  </optgroup>
                  <optgroup label="Design">
                    <option>UI/UX Design</option>
                    <option>Graphic Design</option>
                    <option>Video Editing</option>
                    <option>3D Modeling</option>
                  </optgroup>
                  <optgroup label="Business">
                    <option>Digital Marketing</option>
                    <option>Business & Entrepreneurship</option>
                    <option>Finance & Accounting</option>
                    <option>Project Management</option>
                    <option>HR & Leadership</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option>Personal Development</option>
                    <option>Language Learning</option>
                    <option>Health & Fitness</option>
                    <option>Photography</option>
                    <option>Music</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-base font-semibold text-gray-800">Level</label>
                <select
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                >
                  <option value="">Select</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* PRICE WITH ₹ */}
              <div>
                <label className="text-base font-semibold text-gray-800">Price</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                </div>
              </div>

            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-base font-semibold text-gray-800">Thumbnail</label>

              <input type="file" ref={thumb} hidden onChange={handleThumbnail} />

              <div
                className="relative w-[320px] h-[180px] mt-2 cursor-pointer group"
                onClick={() => thumb.current.click()}
              >
                <img src={frontendImage}
                  className="w-full h-full object-cover rounded-xl border border-gray-300" />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white text-sm">
                  Change
                </div>

                <MdEdit className="absolute top-2 right-2 text-white" />
              </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-4'>
              <button
                className='px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition'
                onClick={() => navigate("/courses")}
              >
                Cancel
              </button>

              <button
                className='px-6 py-2 rounded-xl bg-gray-900 text-white 
                hover:bg-black hover:scale-105 active:scale-95 
                transition-all duration-200 shadow-md hover:shadow-lg 
                flex items-center justify-center'
                disabled={loading}
                onClick={editCourseHandler}
              >
                {loading ? <ClipLoader size={20} color='white' /> : "Save"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCourses