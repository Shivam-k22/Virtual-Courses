import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import { useSelector } from 'react-redux';

function FilterLabel({ children }) {
  return (
    <p className="font-['Syne',sans-serif] text-[11px] tracking-[0.14em] uppercase text-blue-400 mb-3 mt-5 first:mt-0 font-semibold">
      {children}
    </p>
  );
}

function CheckRow({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mb-[10px] group">
      <div
        className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
          checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-[1.5px] border-slate-300'
        }`}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5l2 2L7.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" value={value} onChange={onChange} className="sr-only" />
      <span
        className={`text-[14px] transition-colors duration-150 ${
          checked ? 'text-blue-600 font-semibold' : 'text-slate-600 font-medium group-hover:text-blue-600'
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function AllCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseData } = useSelector(state => state.course);

  const [category, setCategory] = useState([]);
  const [level, setLevel] = useState([]);
  const [price, setPrice] = useState("all");
  const [rating, setRating] = useState(0);
  const [filterCourses, setFilterCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const navCategory = location.state?.category;
    if (navCategory) setCategory([navCategory]);
  }, [location.state?.category]);

  const toggleCategory = (e) => {
    const v = e.target.value;
    setCategory(p => p.includes(v) ? p.filter(i => i !== v) : [...p, v]);
  };

  const toggleLevel = (e) => {
    const v = e.target.value;
    setLevel(p => p.includes(v) ? p.filter(i => i !== v) : [...p, v]);
  };

  const applyFilter = () => {
    let c = [...courseData];
    const q = location.state?.query;
    if (q) {
      const query = q.toLowerCase();
      c = c.filter(x =>
        x.title.toLowerCase().includes(query) ||
        x.category.toLowerCase().includes(query)
      );
    }
    if (category.length) c = c.filter(x => category.includes(x.category));
    if (level.length) c = c.filter(x => level.includes(x.level));
    if (price === "free") c = c.filter(x => x.price === 0);
    else if (price === "paid") c = c.filter(x => x.price > 0);
    if (rating > 0) c = c.filter(x => (x.avgRating || 0) >= rating);
    setFilterCourses(c);
  };

  useEffect(() => { applyFilter(); }, [courseData, category, level, price, rating, location.state]);

  const activeCount = category.length + level.length + (price !== "all" ? 1 : 0) + (rating > 0 ? 1 : 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto px-5 pb-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-blue-200 [&::-webkit-scrollbar-thumb]:rounded-full">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <FaArrowLeftLong className="text-blue-500 text-xs" />
        </button>
        <div>
          <h2 className="font-['Syne',sans-serif] text-slate-800 text-[17px] font-bold leading-none">Filters</h2>
          {activeCount > 0 && (
            <span className="text-[12px] text-blue-500 font-semibold mt-0.5 block">{activeCount} active</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => { setCategory([]); setLevel([]); setPrice("all"); setRating(0); }}
            className="ml-auto text-[12px] font-medium text-slate-400 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="w-full h-px bg-slate-100 mb-4" />

      <FilterLabel>Category</FilterLabel>
      {["Web Development", "App Development", "Data Science", "UI/UX Design", "AI/ML", "Ethical Hacking", "Data Analytics"].map(cat => (
        <CheckRow key={cat} label={cat} value={cat} checked={category.includes(cat)} onChange={toggleCategory} />
      ))}

      <FilterLabel>Level</FilterLabel>
      {["Beginner", "Intermediate", "Advanced"].map(lvl => (
        <CheckRow key={lvl} label={lvl} value={lvl} checked={level.includes(lvl)} onChange={toggleLevel} />
      ))}

      <FilterLabel>Price</FilterLabel>
      <div className="flex gap-2 mb-1">
        {[["all", "All"], ["free", "Free"], ["paid", "Paid"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setPrice(v)}
            className={`flex-1 rounded-lg py-[6px] text-[13px] font-semibold cursor-pointer transition-all duration-150 border ${
              price === v
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <FilterLabel>Min. Rating</FilterLabel>
      <div className="flex flex-col gap-2">
        {[["0", "Any rating"], ["4", "4+ stars ★★★★"], ["3", "3+ stars ★★★"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setRating(Number(v))}
            className={`w-full rounded-lg py-[8px] px-[10px] text-[13px] font-medium text-left cursor-pointer transition-all duration-150 border ${
              rating === Number(v)
                ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-['DM_Sans',sans-serif]">
      <Nav />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] fixed top-0 left-0 h-full pt-[68px] bg-white border-r border-slate-100 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-[260px] h-full bg-white border-r border-slate-100 flex flex-col pt-6 z-10 shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-[240px] flex-1 pt-[68px] min-h-screen">

        {/* Top bar */}
        <div className="sticky top-[68px] z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <div>
              <h1 className="font-['Syne',sans-serif] text-slate-800 text-[18px] font-bold leading-none">All Courses</h1>
              <p className="text-slate-400 text-[12px] font-medium mt-0.5">
                {filterCourses.length} course{filterCourses.length !== 1 ? "s" : ""} found
                {location.state?.query && (
                  <span className="ml-1.5 text-blue-500">for "{location.state.query}"</span>
                )}
                {location.state?.category && (
                  <span className="ml-1.5 text-blue-400">in {location.state.category}</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter pills */}
        {activeCount > 0 && (
          <div className="px-6 py-2.5 flex flex-wrap gap-2 bg-blue-50 border-b border-blue-100">
            {category.map(c => (
              <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[12px] font-semibold">
                {c}
                <button
                  className="bg-transparent border-none cursor-pointer text-inherit p-0 text-[14px] leading-none opacity-70 hover:opacity-100"
                  onClick={() => setCategory(p => p.filter(i => i !== c))}
                >×</button>
              </span>
            ))}
            {level.map(l => (
              <span key={l} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-[12px] font-semibold">
                {l}
                <button
                  className="bg-transparent border-none cursor-pointer text-inherit p-0 text-[14px] leading-none opacity-70 hover:opacity-100"
                  onClick={() => setLevel(p => p.filter(i => i !== l))}
                >×</button>
              </span>
            ))}
            {price !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[12px] font-semibold">
                {price === "free" ? "Free" : "Paid"}
                <button
                  className="bg-transparent border-none cursor-pointer text-inherit p-0 text-[14px] leading-none opacity-70 hover:opacity-100"
                  onClick={() => setPrice("all")}
                >×</button>
              </span>
            )}
            {rating > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-[12px] font-semibold">
                {rating}+ stars
                <button
                  className="bg-transparent border-none cursor-pointer text-inherit p-0 text-[14px] leading-none opacity-70 hover:opacity-100"
                  onClick={() => setRating(0)}
                >×</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="p-6">
          {filterCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filterCourses.map((course, i) => (
                <div
                  key={course._id}
                  className="transition-transform duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(37,99,235,0.10)] animate-[fadeInUp_0.35s_ease_both]"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  <Card
                    thumbnail={course.thumbnail}
                    title={course.title}
                    subTitle={course.subTitle}
                    price={course.price}
                    category={course.category}
                    id={course._id}
                    reviews={course.reviews}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#93c5fd" strokeWidth="1.5" />
                  <path d="M18 18l6 6" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 12h6M12 9v6" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-['Syne',sans-serif] text-slate-700 text-xl font-bold mb-2">No courses found</h3>
              <p className="text-slate-500 text-[14px] font-medium max-w-xs leading-relaxed">
                Try adjusting your filters or search query to discover more courses.
              </p>
              <button
                onClick={() => { setCategory([]); setLevel([]); setPrice("all"); setRating(0); }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add to tailwind.config.js → theme.extend:
          keyframes: { fadeInUp: { from: { opacity:'0', transform:'translateY(14px)' }, to: { opacity:'1', transform:'translateY(0)' } } }
          animation:  { fadeInUp: 'fadeInUp 0.35s ease both' }
      */}
    </div>
  );
}

export default AllCourses;