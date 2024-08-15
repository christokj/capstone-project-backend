import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(400).json({ success: false, message: "user not authenticated" });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!tokenVerified) {
            return res.status(400).json({ success: false, message: "user not authenticated" });
        }

        req.user = tokenVerified;

        next();
    } catch (error) {
        console.log(error);
    }
};
