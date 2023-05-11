import express from "express";
import {
  getAllProducts,
  createProduct,
  addToCart,
  getProductDetails,
} from "../controllers/productControllers.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/allproducts").get(getAllProducts);

router.route("/create").post(createProduct);

router.route("/:id").get(getProductDetails)

router.route("/addtocart/:id").post(isAuthenticated, addToCart);

export default router;