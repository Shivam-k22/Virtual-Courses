import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux'

function ReviewPage() {
  const [latestReview, setLatestReview] = useState([])
  const { allReview } = useSelector(state => state.review)

  useEffect(() => {
    setLatestReview(allReview.slice(0, 6))
  }, [allReview])

  return (
    <section className="w-full bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-extrabold tracking-widest uppercase text-blue-500 mb-4">
            — Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-5">
            Real Reviews from{' '}
            <span className="text-blue-600">Real Learners</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Discover how our Virtual Courses platform is transforming learning experiences
            through real feedback from students and professionals worldwide.
          </p>
        </div>

        {/* Reviews grid — smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestReview.map((item, index) => (
            <div key={index} className="group flex flex-col justify-between bg-white border-2 border-slate-200 hover:border-blue-400 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

              {/* Top: quote + stars */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    i < item.rating
                      ? <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      : <svg key={i} className="w-3 h-3 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-slate-500 text-2xs leading-relaxed flex-1 mb-3 line-clamp-3">
                "{item.comment}"
              </p>

              {/* Reviewer */}
              <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.user.photoUrl}
                    alt={item.user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white ring-2 ring-blue-100"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-2xs leading-tight">{item.user.name}</p>
                  <p className="text-slate-400 text-2xs">{item.user.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ReviewPage
