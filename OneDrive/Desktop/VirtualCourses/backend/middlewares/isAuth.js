import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {

    const token = req.cookies.token   // ✅ cleaner way

    if (!token) {
      return res.status(401).json({ message: "No token, not authorized" })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.userId = verifyToken.userId   // ✅ important
    next()

  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Auth failed" })
  }
}

export default isAuth