import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization token is required" });
    }

    // Split the Authorization header to separate the "Bearer" keyword from the token
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: "Invalid authorization header format" });
    }

    try {
        // Verify the token without the "Bearer " prefix
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            } else {
                req.user = decoded;
                next();
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default auth;
