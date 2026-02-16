// Auth middleware - Protect routes with JWT verification
import * as authService from "../services/auth.service.js";

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = authService.verifyToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
