import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  profile,
  getCartItems,
} from "../controllers/userControllers.js";

import {isAuthenticated} from "../middlewares/auth.js";

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/profile").get(isAuthenticated, profile);

router.route("/cart").get(isAuthenticated, getCartItems);

export default router;