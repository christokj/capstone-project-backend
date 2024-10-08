import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {

    const { token } = req.cookies;
    
    if (!token) {
        return res.status(400).json({ success: false, message: "user not authenticated" });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (tokenVerified.role !== 'user') {
        return res.status(400).json({ success: false, message: "user not authenticated" });
    }

    req.user = tokenVerified;

    next();
};
