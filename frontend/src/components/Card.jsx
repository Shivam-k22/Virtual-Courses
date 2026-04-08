import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, subTitle, category, price, id, reviews }) => {
  const navigate = useNavigate();

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail — fixed height */}
      <div className="relative w-full h-36 flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-white text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize shadow-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">

        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[3rem]">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {subTitle || ""}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-1" />

        {/* Footer: Price + Rating */}
        <div className="flex items-center justify-between pt-1.5">

          {/* Price */}
          <span className="text-base font-extrabold text-gray-900">
            {!price || price === 0 ? (
              <span className="text-emerald-600 font-bold">Free</span>
            ) : (
              `₹${price}`
            )}
          </span>

          {/* Rating */}
          {avgRating !== null ? (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              <FaStar className="text-amber-400 text-xs" />
              <span className="text-sm font-semibold text-amber-700">{avgRating}</span>
              <span className="text-xs text-amber-500">({reviews.length})</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">No reviews yet</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
