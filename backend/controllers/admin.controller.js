import User from "../models/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";
import Admin from "../models/admin.model.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
        lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    const validatedData = adminSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message) });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ errors: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });

        await newAdmin.save();
        res.status(201).json({ message: "Signup succeeded", admin: { id: newAdmin._id, firstName, email } });
    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ errors: "Error in signup" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ errors: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ errors: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict", 
        });

        res.status(200).json({ message: "Login successful", admin: { id: admin._id, firstName: admin.firstName, email: admin.email }, token });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ errors: "Error in login" });
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({ errors: "Kindly login first" });
        }

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