import Course from "../models/courseModel.js";
import razorpay from 'razorpay'
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";  // ✅ ADD THIS IMPORT
import dotenv from "dotenv"
dotenv.config()

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if course is free
    if (!course.price || course.price === 0) {
      return res.status(400).json({ message: "This course is free. Please use free enrollment." });
    }

    const options = {
      amount: course.price * 100, // in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Order created:", order);
    
    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: `Order creation failed ${err}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;
    
    console.log("Verifying payment:", { razorpay_order_id, courseId, userId });
    
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log("Order info from Razorpay:", orderInfo);
    
    if (orderInfo.status === 'paid') {
      // Get course for amount
      const course = await Course.findById(courseId);
      const amountInPaise = orderInfo.amount;
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // ✅ CREATE ORDER IN DATABASE (THIS IS WHAT'S MISSING)
      const newOrder = await Order.create({
        course: courseId,
        student: userId,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        amount: amountInPaise, // Store in paisa
        currency: 'INR',
        isPaid: true,
        paidAt: new Date()
      });
      
      console.log("Order saved to database:", newOrder);
      
      // Update user enrollment
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
        console.log("User enrolled:", userId);
      }

      // Update course enrollment
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
        console.log("Course enrollment updated:", courseId);
      }

      return res.status(200).json({ 
        message: "Payment verified and enrollment successful",
        order: newOrder 
      });
    } else {
      return res.status(400).json({ message: "Payment verification failed - payment not paid" });
    }
  } catch (error) {
    console.log("Payment verification error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};