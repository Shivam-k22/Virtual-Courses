import React, { useState } from 'react'
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Area, AreaChart
} from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaBook, FaUserGraduate, FaUser, FaSignOutAlt, FaBars
} from "react-icons/fa";

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 text-base shadow-lg">
        <p className="text-blue-400 text-sm">{label}</p>
        <p className="text-black">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

/* ── Stat Card ── */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className="bg-blue-50 text-blue-600 rounded-xl p-3 text-2xl flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <span className="text-black text-xs uppercase tracking-widest block opacity-50">{label}</span>
      <span className="text-2xl text-black leading-tight block truncate">{value}</span>
    </div>
  </div>
);

/* ── Sidebar Nav Item ── */
const NavItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-base transition
      ${active
        ? 'bg-white text-blue-700 shadow-sm'
        : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
  >
    <span className="text-base flex-shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const [courseFilter, setCourseFilter] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Calculations ── */
  const totalCourses = creatorCourseData?.length || 0;
  const totalStudents = creatorCourseData?.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0), 0
  ) || 0;
  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const students = course.enrolledStudents?.length || 0;
    return sum + (course.price ? course.price * students : 0);
  }, 0) || 0;

  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + (course.title.length > 10 ? '…' : ''),
    lectures: course.lectures?.length || 0,
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + (course.title.length > 10 ? '…' : ''),
    enrolled: course.enrolledStudents?.length || 0,
  })) || [];

  const filteredCourses = creatorCourseData?.filter(course => {
    if (courseFilter === 'free') return !course.price || course.price === 0;
    if (courseFilter === 'paid') return course.price > 0;
    return true;
  }) || [];

  const navItems = [
    { key: 'home',     icon: <FaHome />,        label: 'Home',            path: '/' },
    { key: 'courses',  icon: <FaBook />,         label: 'My Courses',         path: '/courses' },
    { key: 'enrolled', icon: <FaUserGraduate />, label: 'Enrolled Courses',path: '/enrolledcourses' },
    { key: 'profile',  icon: <FaUser />,         label: 'Profile',         path: '/profile' },
  ];

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white font-sans">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ════ SIDEBAR ════ */}
      <aside className={`
        fixed lg:static top-0 left-0 z-30 h-full w-56
        bg-gradient-to-b from-blue-700 to-blue-900
        flex flex-col py-5 px-3 shadow-2xl
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 px-2 flex-shrink-0">
          <img
            src="/logo.jpg"
            alt="VC logo"
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <span className="font-normal text-xl tracking-tight leading-none">
            <span className="text-white">Virtual </span>
            <span className="text-blue-300">Courses</span>
          </span>
        </div>

        {/* Educator greeting */}
        <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 mb-10 flex-shrink-0">
          <img
            src={userData?.photoUrl || img}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-white/30 object-cover flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-white/60 text-[10px] uppercase tracking-widest">Welcome back</p>
            <p className="text-white text-base truncate">
              {userData?.name || "Educator"}
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => {
                setActiveNav(item.key);
                navigate(item.path);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-base
            text-red-300 hover:bg-red-500/20 hover:text-red-200 transition mt-2 flex-shrink-0"
        >
          <FaSignOutAlt className="flex-shrink-0" />
          Log Out
        </button>
      </aside>

      {/* ════ MAIN CONTENT ════ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 text-lg">
            <FaBars />
          </button>
          <span className="font-extrabold text-black text-base">Dashboard</span>
          <button
            onClick={() => navigate("/createcourses")}
          >
            + Create Course
          </button>
        </div>

        {/* Scrollable area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex flex-col gap-4 text-black">

          {/* Desktop page heading */}
          <div className="hidden lg:flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-3xl text-black">Dashboard</h2>
              <p className="text-black text-sm opacity-50 mt-1">Overview of your teaching activity</p>
            </div>
            <button
              onClick={() => navigate("/createcourses")}
              className="bg-blue-700 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition text-base"
            >
              + Create Course
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Total Courses"  value={totalCourses}  icon={<FaBook />} />
            <StatCard label="Total Students" value={totalStudents} icon={<FaUserGraduate />} />
            <StatCard label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon="₹" />
          </div>

          {/* Charts — fixed pixel height so Recharts renders correctly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <p className="mb-3 text-black text-base">Lectures per Course</p>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseProgressData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#000' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="lectures" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <p className="mb-3 text-black text-base">Enrollments</p>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#000' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="enrolled" stroke="#2563eb" fill="#bfdbfe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <p className="text-black text-base">Courses</p>
              <div className="flex gap-2">
                {['all', 'paid', 'free'].map(f => (
                  <button
                    key={f}
                    onClick={() => setCourseFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm transition
                      ${courseFilter === f
                        ? 'bg-blue-700 text-white shadow'
                        : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-base table-fixed">
                <thead>
                  <tr className="text-left text-black border-b border-gray-100 text-sm uppercase tracking-wide">
                    <th className="py-3 px-4 w-10">#</th>
                    <th className="py-3 px-2 w-48">Course</th>
                    <th className="py-3 px-2 w-24">Students</th>
                    <th className="py-3 px-2 w-24">Price</th>
                    <th className="py-3 px-2 w-28">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-black opacity-30 text-base">
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((c, i) => {
                      const revenue = (c.price || 0) * (c.enrolledStudents?.length || 0);
                      return (
                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50 transition">
                          <td className="py-3 px-4 text-black opacity-40">{i + 1}</td>
                          <td className="py-3 px-2 text-black max-w-0">
                            <span className="block truncate" title={c.title}>{c.title}</span>
                          </td>
                          <td className="py-3 px-2 text-black">{c.enrolledStudents?.length || 0}</td>
                          <td className="py-3 px-2 text-black">{c.price ? `₹${c.price}` : 'Free'}</td>
                          <td className="py-3 px-2 text-blue-700">₹{revenue.toLocaleString()}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;