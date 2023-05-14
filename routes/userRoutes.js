import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  profile,
  getCartItems,
  placeOrder,
} from "../controllers/userControllers.js";

import {isAuthenticated} from "../middlewares/auth.js";

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/profile").get(isAuthenticated, profile);

router.route("/cart").get(isAuthenticated, getCartItems);

router.route("/checkout").get(isAuthenticated, placeOrder);

export default router;