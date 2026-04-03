import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from "./pages/About";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify'
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'
import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import getAllReviews from './customHooks/getAllReviews'
import { ClipLoader } from 'react-spinners'
import axios from "axios";


export const serverUrl = "http://localhost:8000"

axios.defaults.withCredentials = true;

function App() {

  const { userData, loading } = useSelector(state => state.user)

  // ✅ CALL HOOKS DIRECTLY (IMPORTANT)
  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()

  // ✅ BLOCK UI UNTIL USER LOADS
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#2563eb" />
      </div>
    )
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      <Routes>

        {/* PUBLIC */}
        <Route path='/' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        {/* USER */}
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/allcourses' element={userData ? <AllCouses /> : <Navigate to="/login" />} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to="/login" />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to="/login" />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to="/login" />} />

        {/* ADMIN */}
        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to="/login" />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to="/login" />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to="/login" />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/login" />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/login" />} />

      </Routes>
    </>
  )
}

export default App