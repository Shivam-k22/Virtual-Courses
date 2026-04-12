import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaLock } from "react-icons/fa";
import { FaStar, FaCirclePlay } from "react-icons/fa6";
import img from "../assets/empty.jpg";
import { setSelectedCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";
import Nav from "../components/Nav";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData, selectedCourseData } = useSelector((s) => s.course);
  const { userData } = useSelector((s) => s.user);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("curriculum");

  const avgRating = selectedCourseData?.reviews?.length
    ? (
        selectedCourseData.reviews.reduce((a, b) => a + b.rating, 0) /
        selectedCourseData.reviews.length
      ).toFixed(1)
    : 0;

  const formatPrice = (price) => (!price ? "Free" : `₹${price}`);

  useEffect(() => {
    courseData.forEach((c) => {
      if (c._id === courseId) dispatch(setSelectedCourseData(c));
    });
    const enrolled = userData?.enrolledCourses?.some(
      (c) => (typeof c === "string" ? c : c._id) === courseId
    );
    setIsEnrolled(enrolled);
  }, [courseId, courseData, userData]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourseData?.creator) return;
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/getcreator`,
          { userId: selectedCourseData.creator },
          { withCredentials: true }
        );
        setCreatorData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCreator();
  }, [selectedCourseData]);

const handleEnroll = async () => {
  try {
    // FREE COURSE
    if (!selectedCourseData?.price || selectedCourseData.price === 0) {
      await axios.post(
        serverUrl + "/api/course/enroll-free",
        { courseId, userId: userData?._id },
        { withCredentials: true }
      );
      setIsEnrolled(true);
      toast.success("Enrolled Successfully");
      return;
    }

    // PAID COURSE - CREATE ORDER
    console.log("Creating order for course:", courseId);
    const { data: order } = await axios.post(
      serverUrl + "/api/payment/create-order",
      { courseId },
      { withCredentials: true }
    );
    
    console.log("Order created:", order);

    // OPEN RAZORPAY
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Virtual Courses",
      description: selectedCourseData.title,
      image: "/logo.jpg",
      handler: async (response) => {
        console.log("Payment response:", response);
        
        try {
          // ✅ SEND ALL PAYMENT DETAILS
          const verifyResponse = await axios.post(
            serverUrl + "/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseId,
              userId: userData?._id
            },
            { withCredentials: true }
          );
          
          console.log("Verification response:", verifyResponse.data);
          
          setIsEnrolled(true);
          toast.success("Payment Successful! You are now enrolled 🎉");
          
          // Refresh user data
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } catch (err) {
          console.log("Verification error:", err);
          toast.error(err.response?.data?.message || "Payment verification failed");
        }
      },
      modal: {
        ondismiss: function() {
          toast.info("Payment cancelled");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.log("Enrollment error:", error);
    toast.error(error.response?.data?.message || "Payment failed!");
  }
};

  const tabs = ["curriculum", "overview", "reviews"];

  return (
    <div className="min-h-screen bg-slate-50">

      <Nav />

      {/* HERO */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white pt-12 pb-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_360px] gap-12 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            {/* Category pill */}
            {selectedCourseData?.category && (
              <span className="w-fit text-sm font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full capitalize">
                {selectedCourseData.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {selectedCourseData?.title}
            </h1>

            {/* Subtitle */}
            {selectedCourseData?.subTitle && (
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                {selectedCourseData.subTitle}
              </p>
            )}

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-amber-400 font-bold text-base">{avgRating}</span>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(avgRating) ? "text-amber-400" : "text-gray-600"}`}
                  />
                ))}
              </div>
              <span className="text-blue-400 text-base underline cursor-pointer hover:text-blue-300 transition">
                ({selectedCourseData?.reviews?.length || 0} ratings)
              </span>
              <span className="text-gray-500 text-base">·</span>
              <span className="text-gray-400 text-base">
                {selectedCourseData?.enrolledStudents?.length || 0} students enrolled
              </span>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {creatorData?.name?.slice(0, 1).toUpperCase() || "?"}
              </div>
              <p className="text-base text-gray-400">
                Created by{" "}
                <span className="text-blue-300 font-semibold hover:text-white transition cursor-pointer">
                  {creatorData?.name || "Instructor"}
                </span>
              </p>
            </div>

            {/* Meta pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <FaCirclePlay className="w-3.5 h-3.5 text-blue-400" />
                {selectedCourseData?.lectures?.length || 0} lectures
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <span className="text-blue-400">🌐</span>
                Hindi / English
              </span>
              {selectedCourseData?.level && (
                <span className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full capitalize">
                  {selectedCourseData.level}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden h-fit sticky top-24 border border-gray-100">

            {/* Thumbnail */}
            <div className="relative">
              <img
                src={selectedCourseData?.thumbnail || img}
                className="w-full h-48 object-cover"
                alt="Course thumbnail"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(selectedCourseData?.price)}
                </span>
                {selectedCourseData?.price > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Math.round(selectedCourseData.price * 1.3)}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => isEnrolled ? navigate(`/viewlecture/${courseId}`) : handleEnroll()}
                className={`w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg
                  ${isEnrolled
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                  }`}
              >
                {isEnrolled
  ? "▶ Watch Course"
  : selectedCourseData?.price === 0
    ? "Enroll for Free"
    : "Buy Now"
}
              </button>

              {!isEnrolled && (
                <p className="text-center text-xs text-gray-400">30-Day Money-Back Guarantee</p>
              )}

              {/* Course info grid */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">Course Includes</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lectures</span>
                  <span className="font-semibold text-gray-800">{selectedCourseData?.lectures?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students</span>
                  <span className="font-semibold text-gray-800">{selectedCourseData?.enrolledStudents?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Language</span>
                  <span className="font-semibold text-gray-800">Hindi / English</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Access</span>
                  <span className="font-semibold text-gray-800">Full Lifetime</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200 sticky top-[68px] z-30">
        <div className="max-w-6xl mx-auto px-6 flex gap-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`relative py-4 px-7 text-base font-bold capitalize tracking-wide transition-all duration-200
                ${activeTab === t
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-800"
                }`}
            >
              {t}
              {activeTab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* CURRICULUM TAB */}
        {activeTab === "curriculum" && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Lecture list */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Course Content</h3>
                <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-full">
                  {selectedCourseData?.lectures?.length || 0} lectures
                </span>
              </div>

              <div className="flex flex-col divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                {selectedCourseData?.lectures?.map((lec, i) => (
                  <button
                    key={i}
                    onClick={() => lec.isPreviewFree && setSelectedLecture(lec)}
                    className={`flex items-center gap-4 px-5 py-4 text-left w-full transition-all duration-150 group
                      ${lec.isPreviewFree
                        ? "hover:bg-blue-50/60 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                      }
                      ${selectedLecture === lec ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                      ${selectedLecture === lec
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}>
                      {lec.isPreviewFree
                        ? <FaCirclePlay className="w-3.5 h-3.5" />
                        : <FaLock className="w-3 h-3" />
                      }
                    </span>

                    <span className={`flex-1 text-sm font-medium line-clamp-2 leading-snug
                      ${selectedLecture === lec ? "text-blue-700 font-semibold" : "text-gray-700"}`}>
                      {lec.lectureTitle}
                    </span>

                    {lec.isPreviewFree && (
                      <span className="shrink-0 text-xs text-blue-500 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Video preview */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                <h3 className="text-sm font-bold text-gray-900">Preview</h3>
              </div>
              <div className="aspect-video bg-gray-950 flex items-center justify-center">
                {selectedLecture?.videoUrl ? (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <FaCirclePlay className="text-2xl text-white/50" />
                    </div>
                    <p className="text-sm text-gray-500">Select a free lecture to preview</p>
                  </div>
                )}
              </div>
              {selectedLecture && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">Playing</p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{selectedLecture.lectureTitle}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <h3 className="text-sm font-bold text-gray-900">About this Course</h3>
            </div>
            <div className="px-6 py-6 text-sm text-gray-600 leading-relaxed">
              {selectedCourseData?.description || (
                <span className="text-gray-400 italic">No description available.</span>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Student Reviews</h3>
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                {avgRating} ★ avg
              </span>
            </div>
            {selectedCourseData?.reviews?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-50 px-6 py-2">
                {selectedCourseData.reviews.map((rev, i) => (
                  <div key={i} className="py-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {rev.userId?.name?.slice(0, 1).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{rev.userId?.name || "Student"}</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-amber-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                    {rev.comment && <p className="text-sm text-gray-500 pl-9">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <FaStar className="text-xl text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">No reviews yet</p>
                <p className="text-xs text-gray-300">Be the first to review this course</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* OTHER COURSES BY INSTRUCTOR */}
      {creatorData && (
        <div className="max-w-6xl mx-auto px-6 pb-12">

          {/* Section header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-1">More from this Instructor</p>
            <h2 className="text-xl font-bold text-gray-900">
              Other Courses by{" "}
              <span className="text-blue-600">{creatorData?.name}</span>
            </h2>
          </div>

          {/* Courses grid — Card.jsx style */}
          {courseData?.filter(
            (c) => c.creator === selectedCourseData?.creator && c._id !== courseId && c.isPublished
          ).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courseData
                .filter((c) => c.creator === selectedCourseData?.creator && c._id !== courseId && c.isPublished)
                .map((course) => {
                  const courseAvgRating = course.reviews?.length
                    ? (course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length).toFixed(1)
                    : null;

                  return (
                    <div
                      key={course._id}
                      onClick={() => navigate(`/viewcourse/${course._id}`)}
                      className="group w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                        <img
                          src={course.thumbnail || img}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />

                        {/* Category badge */}
                        {course.category && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full capitalize shadow-sm">
                            {course.category}
                          </span>
                        )}

                        {/* Play on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <FaCirclePlay className="text-blue-600 text-xl ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col gap-2">
                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                          {course.title}
                        </h2>

                        {/* Subtitle */}
                        {course.subTitle && (
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {course.subTitle}
                          </p>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-300 my-1" />

                        {/* Footer: Price + Rating */}
                        <div className="flex items-center justify-between">
                          {/* Price */}
                          <span className="text-lg font-extrabold text-gray-900">
                            {!course.price
                              ? <span className="text-emerald-600">Free</span>
                              : `₹${course.price}`
                            }
                          </span>

                          {/* Rating */}
                          {courseAvgRating !== null ? (
                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                              <FaStar className="text-amber-400 text-xs" />
                              <span className="text-sm font-semibold text-amber-700">{courseAvgRating}</span>
                              <span className="text-xs text-amber-500">({course.reviews.length})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No reviews yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FaCirclePlay className="text-xl text-blue-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">No other courses by this instructor</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default ViewCourse;