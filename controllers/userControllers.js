import { catchAsyncError } from "../middlewares/catchAsyncError.js";

import { User } from "../models/UserModel.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { Product } from "../models/ProductModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";



export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;
  

  if (!name || !email || !password || !mobile )
    return next(new ErrorHandler("Please enter all field", 400));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User Already Exist", 409));

  user = await User.create({
    name,
    email,
    mobile,
    password
  });

  sendToken(res, user, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter all field", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email or Password", 401));

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const profile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});


//get cart items;

export const getCartItems = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("cartItems.id");

  if(!user){
    next(new ErrorHandler("User not found", 404));
  }

  const data = user.cartItems.map(item => {
    return {
      product: item.id,
      quantity: item.quantity,
    }
  })
  let totalPrice = 0;
  let discount = 0;
  for(let i = 0; i < data.length; i++){
    totalPrice += data[i].product.price * data[i].quantity;
    // totalDiscount += data[i].product.discount * data[i].quantity;
  }

  res.status(200).json({
    success: true,
    cartItems: data,
    totalPrice: totalPrice,
    discount:0,
    fee: 50,
    total : totalPrice - discount + 50,
  });
})


//place order api;
export const placeOrder = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user._id);
  
  user.cartItems = [];

  await user.save();

  res.status(200).json({
    success: true,
    message: "Order Placed Successfully"
  });
  
})

