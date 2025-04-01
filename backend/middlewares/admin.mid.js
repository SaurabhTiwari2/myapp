import jwt from 'jsonwebtoken'; // Correct package name
import config from '../config.js';

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) { // startsWith() ka sahi use
        return res.status(401).json({ errors: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Token extract karne ka sahi tareeka

    try {
        const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.log("Invalid token or expired token: " + error); // Pehle print fir return
        return res.status(401).json({ errors: "Invalid token or expired" });
    }
}

export default adminMiddleware;
