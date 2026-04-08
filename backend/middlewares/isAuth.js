import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {

    const token = req.cookies.token

    if (!token) {
      return res.status(200).json(null)
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!verifyToken) {
      return res.status(200).json(null)
    }

    req.userId = verifyToken.userId
    next()

  } catch (error) {
    return res.status(200).json(null)
  }
}

export default isAuth