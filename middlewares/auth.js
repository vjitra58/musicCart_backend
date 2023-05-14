import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { User } from "../models/UserModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) return next(new ErrorHandler("Not Logged In", 401));
  const token = bearerHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});
