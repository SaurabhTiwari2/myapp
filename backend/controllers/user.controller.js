import User from "../models/user.model.js"; 
import Purchase from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be at least 3 chars long" }),
        lastName: z.string().min(3, { message: "lastName must be at least 3 chars long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must be at least 6 chars long" }),
    });

    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: "User already exists" });
        }

        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup succeeded", newUser });
    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ errors: "Error in signup" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ errors: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ errors: "Invalid credentials" });
        }

        // JWT token generation (7 days validity)
        const token = jwt.sign(
            { id: user._id },
            config.JWT_USER_PASSWORD,
            { expiresIn: "7d" } // 7 days expiry
        );

        // Setting cookie options
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days validity
            httpOnly: true,   // Cannot be accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // True for HTTPS only
            sameSite: "Strict"   // CSRF protection
        });
    
        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ errors: "Error in login" });
    }
};

/// Logout function
export const logout = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).json({ errors: "Kindly login first" });
        }
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({ errors: "Error in logout" });
    }
};

export const purchases = async (req, res) => {
    const userId = req.userId;
    try {
        const purchased = await Purchase.find({ userId });

        if (!purchased.length) {
            return res.status(200).json({ message: "No purchases found", purchased: [], courseData: [] });
        }

        let purchasedCourseId = [];
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId); // Fixed variable name
        }

        const courseData = await Course.find({ _id: { $in: purchasedCourseId } });

        res.status(200).json({ purchased, courseData });

    } catch (error) {
        res.status(500).json({ errors: "Errors in purchases" });
        console.log("Error in purchase:", error); // Logging actual error
    }
};
