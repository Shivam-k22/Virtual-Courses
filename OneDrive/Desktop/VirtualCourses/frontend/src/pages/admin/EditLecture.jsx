import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)

  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const selectedLecture = lectureData.find(l => l._id === lectureId)

  const [videoUrl, setVideoUrl] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [fileName, setFileName] = useState("")

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [isPreviewFree, setIsPreviewFree] = useState(false)

  // Cleanup preview memory
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview)
    }
  }, [videoPreview])

  const editLecture = async () => {
    setLoading(true)

    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    formData.append("videoUrl", videoUrl)
    formData.append("isPreviewFree", isPreviewFree)

    try {
      const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true }
      )

      const updatedLectures = lectureData.map(l =>
        l._id === lectureId ? result.data : l
      )

      dispatch(setLectureData(updatedLectures))
      toast.success("Lecture Updated")
      navigate("/courses")

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    setLoading1(true)
    try {
      await axios.delete(
        serverUrl + `/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      )

      toast.success("Lecture Removed")
      navigate(`/createlecture/${courseId}`)

    } catch (error) {
      console.log(error)
      toast.error("Lecture remove error")
    } finally {
      setLoading1(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">

      <div className="relative w-full max-w-xl">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-3xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FaArrowLeft
              className="text-gray-500 cursor-pointer hover:text-black transition"
              onClick={() => navigate(`/createlecture/${courseId}`)}
            />
            <h2 className="text-xl font-bold text-gray-900">
              Edit Lecture
            </h2>
          </div>

          {/* Remove Button */}
          <div className="mb-6">
            <button
              className="px-4 py-2 rounded-xl bg-red-600 text-white 
              hover:bg-red-700 hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading1}
              onClick={removeLecture}
            >
              {loading1 ? <ClipLoader size={20} color='white' /> : "Remove Lecture"}
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">

            {/* Title */}
            <div>
              <label className="text-base font-semibold text-gray-800">
                Lecture Title
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
                onChange={(e) => setLectureTitle(e.target.value)}
                value={lectureTitle}
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="text-base font-semibold text-gray-800">
                Upload Video
              </label>

              {/* OLD FILE NAME */}
              {selectedLecture?.videoUrl && !fileName && (
                <p className="text-sm text-gray-500 mt-2">
                  🎬 Current: {selectedLecture.videoUrl.split('/').pop()}
                </p>
              )}

              {/* INPUT */}
              <input
                type="file"
                accept='video/*'
                className="w-full mt-2 border border-gray-200 rounded-xl p-2 
                file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                file:border-0 file:text-sm file:bg-gray-900 file:text-white 
                hover:file:bg-black transition"
                onChange={(e) => {
                  const file = e.target.files[0]

                  if (file) {
                    setVideoUrl(file)
                    setFileName(file.name)

                    const preview = URL.createObjectURL(file)
                    setVideoPreview(preview)
                  }
                }}
              />

              {/* NEW FILE NAME */}
              {fileName && (
                <p className="text-sm text-green-600 mt-2 font-semibold break-all">
                  🆕 New: {fileName}
                </p>
              )}

              {/* OLD VIDEO (HIDDEN AFTER NEW UPLOAD) */}
              {selectedLecture?.videoUrl && !videoPreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">🎬 Current Video</p>
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* NEW VIDEO PREVIEW */}
              {videoPreview && (
                <div className="mt-3">
                  <p className="text-sm text-green-600 mb-1 font-semibold">
                    🆕 New Video Preview
                  </p>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
              <input
                type="checkbox"
                className="accent-black h-5 w-5 cursor-pointer"
                checked={isPreviewFree}
                onChange={() => setIsPreviewFree(prev => !prev)}
              />
              <label className="text-sm text-gray-700 font-medium">
                Free Preview Lecture
              </label>
            </div>

            {/* Submit */}
            <button
              className="w-full py-3 rounded-xl bg-gray-900 text-white 
              hover:bg-black hover:scale-105 active:scale-95 
              transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
              onClick={editLecture}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Update Lecture"}
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default EditLecture