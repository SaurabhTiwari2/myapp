
import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Purchase from "../models/purchase.model.js";

// Cloudinary Configuration (Make sure ENV variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "All fields are required" });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ errors: "No file uploaded" });
        }

        const image = req.files.image;

        const allowedFormat = ["image/png", "image/jpeg"];
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ errors: "Invalid file format, only PNG and JPG allowed" });
        }

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "courses",
        });

        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ errors: "Error uploading file to Cloudinary" });
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url,
            },
            creatorId: adminId
        };

        const course = await Course.create(courseData);

        res.json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        console.error("Error in createCourse:", error);
        res.status(500).json({ error: "Error creating course" });
    }
};

export const updateCourse = async (req, res) => {
    const admin = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    try {
        const courseSearch = await Course.findById(courseId);
        if (!courseSearch) {
            return res.status(404).json({ errors: "Course not found" });
        }

        let updatedImage = courseSearch.image;

        if (req.files && req.files.image) {
            const image = req.files.image;

            const allowedFormat = ["image/png", "image/jpeg"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({ errors: "Invalid file format, only PNG and JPG allowed" });
            }

            await cloudinary.uploader.destroy(courseSearch.image.public_id);

            const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "courses",
            });

            updatedImage = {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url,
            };
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, creatorId: admin },
            { title, description, price, image: updatedImage },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ errors: "Cant update, created by another admin" });
        }

        res.status(201).json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
        console.error("Error in course updating", error);
        res.status(500).json({ error: "Error updating course" });
    }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        const course = await Course.findOneAndDelete({ _id: courseId, creatorId: adminId });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        await cloudinary.uploader.destroy(course.image.public_id);

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error in course deleting", error);
        res.status(500).json({ errors: "Error deleting course" });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ courses });
    } catch (error) {
        console.error("Error getting courses", error);
        res.status(500).json({ errors: "Error fetching courses" });
    }
};

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ course });
    } catch (error) {
        console.error("Error in course details", error);
        res.status(500).json({ errors: "Error fetching course details" });
    }
};

export const buyCourses = async (req, res) => {
    try {
        const { userId } = req;
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: "Invalid userId or courseId" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        const course = await Course.findById(courseObjectId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({ userId: userObjectId, courseId: courseObjectId });

        if (existingPurchase) {
            return res.status(400).json({ errors: "User has already purchased this course" });
        }

        const newPurchase = new Purchase({
            userId: userObjectId,
            courseId: courseObjectId,
        });

        await newPurchase.save();

        res.status(200).json({ message: "Course purchased successfully", newPurchase });
    } catch (error) {
        console.error("Error in buyCourse:", error);
        res.status(500).json({ errors: "Error purchasing course" });
    }
};
