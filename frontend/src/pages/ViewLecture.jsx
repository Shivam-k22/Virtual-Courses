import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { FaRegStar } from 'react-icons/fa';
import axios from "axios";
import { useSelector } from 'react-redux';
import { serverUrl } from "../App";
import Nav from '../components/Nav';

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Review state
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      });
      setSelectedCourse(res.data);
      setSelectedLecture(res.data?.lectures?.[0] || null);
    } catch (error) {
      console.log("Error fetching course:", error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewRating) {
      setReviewError('Please select a star rating.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment before submitting.');
      return;
    }

    setReviewError('');
    setReviewSubmitting(true);

    try {
      await axios.post(
        `${serverUrl}/api/review/givereview`,
        { courseId, rating: reviewRating, comment: reviewComment },
        { withCredentials: true }
      );
      setReviewSuccess(true);
      setReviewComment('');
      setReviewRating(0);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (error) {
      setReviewError(error?.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  return (
    <div className="min-h-screen w-full bg-gray-50">

      {/* Navbar */}
      <Nav />

      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-2">Now Watching</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                {selectedCourse?.title || "Loading course..."}
              </h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {selectedCourse?.category && (
                  <span className="text-xs text-gray-300 bg-white/10 border border-white/15 px-3 py-1 rounded-full capitalize">
                    {selectedCourse.category}
                  </span>
                )}
                {selectedCourse?.level && (
                  <span className="text-xs text-gray-300 bg-white/10 border border-white/15 px-3 py-1 rounded-full capitalize">
                    {selectedCourse.level}
                  </span>
                )}
              </div>
            </div>

            {selectedCourse?.lectures?.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 self-start sm:self-auto">
                <span className="text-2xl font-bold text-white">{selectedCourse.lectures.length}</span>
                <span className="text-gray-400 text-sm">{selectedCourse.lectures.length === 1 ? "Lecture" : "Lectures"}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6">

        {/* LEFT — Video Player */}
        <div className="w-full lg:w-2/3 flex flex-col gap-5">

          {/* Video */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-900 w-full">
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                  <FaPlayCircle className="text-5xl text-gray-600" />
                  <p className="text-sm">No video available</p>
                </div>
              )}
            </div>

            {/* Lecture info below video */}
            <div className="p-5 border-t border-gray-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">Current Lecture</p>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedLecture?.lectureTitle || "Select a lecture to begin"}
              </h2>
            </div>
          </div>

          {/* Instructor Card — desktop */}
          {courseCreator && (
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Instructor</p>
              <div className="flex items-center gap-4">
                <img
                  src={courseCreator.photoUrl || "/default-avatar.png"}
                  alt="Instructor"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                />
                <div>
                  <h4 className="text-base font-bold text-gray-900">{courseCreator.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                    {courseCreator.description || "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ───────── WRITE A REVIEW SECTION ───────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Section header */}
            <div className="relative px-6 pt-6 pb-5 border-b border-gray-100">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">Share Your Experience</p>
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <p className="text-sm text-gray-500 mt-1">Your feedback helps others learn better.</p>
            </div>

            <div className="px-6 py-6 flex flex-col gap-5">

              {/* Star Rating Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-3xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      {star <= (hoveredRating || reviewRating)
                        ? <FaStar className="text-yellow-400" />
                        : <FaRegStar className="text-gray-300" />
                      }
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="ml-3 text-sm font-medium text-gray-500">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="What did you like or dislike? What did you learn? Would you recommend this course?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="flex justify-between items-center mt-1">
                  {reviewError && (
                    <p className="text-xs text-red-500 font-medium">{reviewError}</p>
                  )}
                  {!reviewError && <span />}
                  <span className="text-xs text-gray-400 ml-auto">{reviewComment.length}/500</span>
                </div>
              </div>

              {/* Success message */}
              {reviewSuccess && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-700">Review submitted successfully! Thank you for your feedback.</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaStar className="text-yellow-300" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT — Lecture List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">All Lectures</h2>
              {selectedCourse?.lectures?.length > 0 && (
                <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                  {selectedCourse.lectures.length} total
                </span>
              )}
            </div>

            {/* Lecture list */}
            <div className="flex flex-col divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <button
                    key={lecture._id}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 group
                      ${selectedLecture?._id === lecture._id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                  >
                    {/* Index number */}
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${selectedLecture?._id === lecture._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                      {index + 1}
                    </span>

                    <span className={`flex-1 text-sm font-semibold leading-snug line-clamp-2
                      ${selectedLecture?._id === lecture._id
                        ? 'text-blue-700'
                        : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                      {lecture.lectureTitle}
                    </span>

                    <FaPlayCircle className={`flex-shrink-0 text-lg transition
                      ${selectedLecture?._id === lecture._id
                        ? 'text-blue-500'
                        : 'text-gray-300 group-hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                  <FaPlayCircle className="text-3xl text-gray-200" />
                  <p className="text-sm">No lectures available</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Card — mobile only */}
          {courseCreator && (
            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Instructor</p>
              <div className="flex items-center gap-4">
                <img
                  src={courseCreator.photoUrl || "/default-avatar.png"}
                  alt="Instructor"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                />
                <div>
                  <h4 className="text-base font-bold text-gray-900">{courseCreator.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                    {courseCreator.description || "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ViewLecture;