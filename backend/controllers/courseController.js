import uploadOnCloudinary from "../configs/cloudinary.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import User from "../models/userModel.js"

// ================== CREATE COURSE ==================
export const createCourse = async (req,res) => {
    try {
        const {title,category} = req.body

        if(!title || !category){
            return res.status(400).json({message:"title and category is required"})
        }

        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        
        return res.status(201).json(course)

    } catch (error) {
        return res.status(500).json({message:`Failed to create course ${error}`})
    }
}

// ================== GET PUBLISHED COURSES ==================
export const getPublishedCourses = async (req,res) => {
    try {
        const courses = await Course.find({isPublished:true})
            .populate("lectures reviews")

        if(!courses){
            return res.status(404).json({message:"Course not found"})
        }

        return res.status(200).json(courses)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get courses ${error}`})
    }
}

// ================== GET CREATOR COURSES ==================
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.userId

        const courses = await Course.find({creator:userId})

        if(!courses){
            return res.status(404).json({message:"Course not found"})
        }

        return res.status(200).json(courses)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get creator courses ${error}`})
    }
}

// ================== EDIT COURSE ==================
export const editCourse = async (req,res) => {
    try {
        const {courseId} = req.params
        const {title , subTitle , description , category , level , price , isPublished } = req.body

        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }

        let course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        const updateData = {
            title,
            subTitle,
            description,
            category,
            level,
            price,
            isPublished,
            ...(thumbnail && {thumbnail})
        }

        course = await Course.findByIdAndUpdate(courseId , updateData , {new:true})

        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({message:`Failed to update course ${error}`})
    }
}

// ================== GET COURSE BY ID ==================
export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params

        const course = await Course.findById(courseId)
            .populate("lectures")

        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        return res.status(200).json(course)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get course ${error}`})
    }
}

// ================== REMOVE COURSE ==================
export const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId

    const course = await Course.findById(courseId)
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    await course.deleteOne()

    return res.status(200).json({ message: "Course Removed Successfully" })

  } catch (error) {
    return res.status(500).json({message:`Failed to remove course ${error}`})
  }
}

// ================== CREATE LECTURE ==================
export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body
        const {courseId} = req.params

        if(!lectureTitle || !courseId){
            return res.status(400).json({message:"Lecture Title required"})
        }

        const lecture = await Lecture.create({lectureTitle})

        const course = await Course.findById(courseId)

        if(course){
            course.lectures.push(lecture._id)
        }

        await course.populate("lectures")
        await course.save()

        return res.status(201).json({lecture,course})
        
    } catch (error) {
        return res.status(500).json({message:`Failed to Create Lecture ${error}`})
    }
}

// ================== GET COURSE LECTURES ==================
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params

        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        await course.populate("lectures")

        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({message:`Failed to get Lectures ${error}`})
    }
}

// ================== EDIT LECTURE ==================
export const editLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree , lectureTitle} = req.body

        const lecture = await Lecture.findById(lectureId)

        if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }

        if(req.file){
            const videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }

        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }

        lecture.isPreviewFree = isPreviewFree

        await lecture.save()

        return res.status(200).json(lecture)

    } catch (error) {
        return res.status(500).json({message:`Failed to edit Lectures ${error}`})
    }
}

// ================== REMOVE LECTURE ==================
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params

        const lecture = await Lecture.findByIdAndDelete(lectureId)

        if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }

        await Course.updateOne(
            {lectures: lectureId},
            {$pull:{lectures: lectureId}}
        )

        return res.status(200).json({message:"Lecture Removed Successfully"})

    } catch (error) {
        return res.status(500).json({message:`Failed to remove Lectures ${error}`})
    }
}

// ================== GET CREATOR BY ID ==================
export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const courses = await Course.find({ creator: userId })

    res.status(200).json({
      ...user._doc,
      courses
    })

  } catch (error) {
    res.status(500).json({ message: "get Creator error" })
  }
}

// ================== ENROLL FREE COURSE ==================
export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body

    const user = await User.findById(userId)
    const course = await Course.findById(courseId)

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" })
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId)
      course.enrolledStudents.push(userId)
    }

    await user.save()
    await course.save()

    res.status(200).json({ message: "Enrolled successfully" })

  } catch (error) {
    res.status(500).json({ message: "Free enroll error" })
  }
}

// ================== ✅ GET ENROLLED COURSES (FIX) ==================
export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: {
        path: "lectures"
      }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user.enrolledCourses)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching enrolled courses" })
  }
}




