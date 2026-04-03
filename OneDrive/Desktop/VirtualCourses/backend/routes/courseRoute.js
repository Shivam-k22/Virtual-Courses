import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { 
  createCourse, 
  createLecture, 
  editCourse, 
  editLecture, 
  getCourseById, 
  getCourseLecture, 
  getCreatorById, 
  getCreatorCourses, 
  getPublishedCourses, 
  removeCourse, 
  removeLecture,
  enrollFreeCourse,
  getEnrolledCourses   // ✅ NEW IMPORT
} from "../controllers/courseController.js"
import upload from "../middlewares/multer.js"

const courseRouter = express.Router()

courseRouter.post("/create", isAuth, createCourse)
courseRouter.get("/getpublishedcoures", getPublishedCourses)
courseRouter.get("/getcreatorcourses", isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/removecourse/:courseId", isAuth, removeCourse)

courseRouter.post("/createlecture/:courseId", isAuth, createLecture)
courseRouter.get("/getcourselecture/:courseId", isAuth, getCourseLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture)

courseRouter.post("/getcreator", isAuth, getCreatorById)

// ✅ ENROLL FREE COURSE
courseRouter.post("/enroll-free", isAuth, enrollFreeCourse)

// ✅ NEW ROUTE (FIX)
courseRouter.get("/enrolled-courses", isAuth, getEnrolledCourses)

export default courseRouter

