import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
config({
  path: "./config/config.env",
});


app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// importing routes;
import user from "./routes/userRoutes.js";
import product from "./routes/productRoutes.js";

app.use("/api/user", user);
app.use("/api/product", product);




app.get("/", (req, res) => {
  res.send(
    `<h1>this is the frontend url <a href="${process.env.FRONTEND_URL}">this</a></h1>`
    );
  });
  
  export default app;

app.use(ErrorMiddleware);


