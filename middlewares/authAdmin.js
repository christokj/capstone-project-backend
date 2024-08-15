import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token)
        if (!token) {
            return res.status(400).json({ success: false, message: "Admin not authenticated" });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!tokenVerified) {
            return res.status(400).json({ success: false, message: "Admin not authenticated" });
        }

        if (tokenVerified.role !== "admin") {
            return res.status(400).json({ message: "Admin not authenticated" });
        }

        req.admin = tokenVerified;
        next();
    } catch (error) {
        console.log(error);
    }
};
