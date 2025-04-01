import express from 'express';
import adminMiddleware from '../middlewares/admin.mid.js';
import userMiddleware from '../middlewares/user.mid.js';

import { 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    getCourses, 
    courseDetails, 
    buyCourses 
} from "../controllers/course.controller.js";

const router = express.Router();

// Admin Routes
router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

// Public Routes
router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);

// User Route
router.post("/buy/:courseId", userMiddleware, buyCourses);

export default router;
