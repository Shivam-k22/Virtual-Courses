import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux'
import { SiViaplay } from "react-icons/si"
import { useNavigate } from 'react-router-dom'

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([])
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6))
  }, [courseData])

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-500 mb-3">
            — Popular Picks
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            Our Popular <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Explore top-rated courses designed to boost your skills, enhance careers,
            and unlock opportunities in tech, AI, business, and beyond.
          </p>
        </div>

        {/* Uniform grid — 4 cols for narrower cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-12">
          {popularCourses.map((item, index) => (
            <Card
              key={index}
              id={item._id}
              thumbnail={item.thumbnail}
              title={item.title}
              subTitle={item.subTitle}
              price={item.price}
              category={item.category}
              reviews={item.reviews}
            />
          ))}
        </div>

        {/* CTA Button — centered, consistent with blue theme */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/allcourses")}
            className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            View All Courses
            <SiViaplay className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default Cardspage
