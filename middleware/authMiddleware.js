import jwt from "jsonwebtoken";
import User from "../models/user.js"; // ✅ small 'u' (file name bhi small hona chahiye)

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

export default protect;
