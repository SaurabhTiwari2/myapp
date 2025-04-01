import dotenv from "dotenv";
dotenv.config(); 

// console.log("JWT_ADMIN_PASSWORD:", process.env.JWT_ADMIN_PASSWORD);

export default {
    JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD || "defaultSecretKey",
    JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD || "defaultSecretKey",
};
