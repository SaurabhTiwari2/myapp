import express from'express';
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import fileUpload from "express-fileupload"
import cookieParser from 'cookie-parser';
import cors from "cors";
// import Slider from "react-slick";
const app = express()
dotenv.config();
// middleware use krenege kuki image,price ye sb mil ni rhe hain
app.use(express.json()); 
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
);
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
const port = process.env.PORT || 3000;
// /Database Connection
const DB_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};
connectDB();
// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
//  defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})