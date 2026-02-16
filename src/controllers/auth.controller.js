// Auth controller - HTTP request/response handling only
import * as authService from "../services/auth.service.js";

// Register handler
export const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // Validate input
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!username) missingFields.push("username");
        if (!password) missingFields.push("password");

        if (missingFields.length > 0) {
            const fieldList = missingFields.join(", ");
            return res.status(400).json({
                error: `${fieldList} ${missingFields.length === 1 ? "is" : "are"} required`,
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Call service
        const result = await authService.registerUser(name, username, password);

        res.status(201).json({
            message: "User registered successfully",
            user: result,
        });
    } catch (err) {
        if (err.message === "Username already exists") {
            return res.status(409).json({ error: err.message });
        }
        console.error("Registration error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login handler
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Call service
        const result = await authService.loginUser(username, password);

        res.json({
            message: "Login successful",
            token: result.token,
            user: result.user,
        });
    } catch (err) {
        // console.log('err', err);

        if (err.message === "Invalid credentials") {
            return res.status(401).json({ error: err.message });
        }
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
