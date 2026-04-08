import React from "react"
import { FaStar, FaRegStar } from "react-icons/fa"
import { FaQuoteLeft } from "react-icons/fa"

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="group flex flex-col justify-between bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* Top row: quote icon + stars */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaQuoteLeft className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-center gap-0.5">
          {Array(5).fill(0).map((_, i) => (
            i < rating
              ? <FaStar key={i} className="w-4 h-4 text-amber-400" />
              : <FaRegStar key={i} className="w-4 h-4 text-slate-300" />
          ))}
        </div>
      </div>

      {/* Review text */}
      <p className="text-slate-600 text-xl leading-relaxed flex-1 mb-6 line-clamp-4">
        "{text}"
      </p>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-5">
        {/* Reviewer info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-blue-100"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm leading-tight">{name}</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{role}</p>
          </div>
          <div className="ml-auto" />
        </div>
      </div>

    </div>
  )
}

export default ReviewCard
