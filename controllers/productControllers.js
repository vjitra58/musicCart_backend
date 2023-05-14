import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";



export const getAllProducts = catchAsyncError(async (req, res, next) => {
    
    const query = {};
    if (req.query.minprice) {
      query.price = { $gte: parseInt(req.query.minprice) };
    }
    if (req.query.maxprice) {
      query.price = { ...query.price, $lte: parseInt(req.query.maxprice) };
    }

    if(req.query.category){
        query.category = new RegExp(req.query.category, 'i');
    }

    if(req.query.brand){
        query.brand = new RegExp(req.query.brand, 'i');
    }

    if(req.query.color){
        query.color = new RegExp(req.query.color, 'i');
    }

    if(req.query.keyword){
        query.description = new RegExp(req.query.keyword, 'i');
    }
    //sort 
    let sort = {};
    if (req.query.sort === "priceinc") {
      sort = { price: 1 };
    } else if (req.query.sort === "pricedec") {
      sort = { price: -1, };
    }else if(req.query.sort === "nameinc"){
        sort = { name : 1}
    }else if(req.query.sort === "namedec"){
        sort = {name : -1}
    }

    //quey the db
    const products = await Product.find(query).sort(sort);

  res.status(200).json({
    count: products.length,
    success: true,
    products,
  });
});

export const createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price,category, color, brand, stock, images } = req.body;

  if (!name || !description || !price || !category || !color || !brand || !stock|| !images)
    return next(new ErrorHandler("Please add all fields", 400));


  await Product.create({
    name, 
    description,
    price,
    category,
    color,
    brand,
    stock,
    images,
  });

  res.status(201).json({
    success: true,
    message: "Product Added Successfully",
  });
});


export const addToCart = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    // const userId = req.query.userId;
    const q = req.body.quantity;
    if(!product){
        next(new ErrorHandler("Product not found", 404));
    }

    const user = await User.findById(req.user._id);

    const cartItem = user.cartItems.find(item => item.id.toString() === product._id.toString());
    if(cartItem){
        if (cartItem.quantity + q >= 0) cartItem.quantity += q;
    }else{
        if(q >= 1)user.cartItems.push({id : product._id, quantity: 1});
    }
    if(cartItem && cartItem.quantity <= 0) user.cartItems = user.cartItems.filter(item => item.id.toString() !== product._id.toString());


    await user.save();
    res.status(200).json({
        message: "product added to cart successfully",
    })
});


export const getProductDetails = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if(!product){
        next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    })

}) 


