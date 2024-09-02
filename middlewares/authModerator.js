import jwt from "jsonwebtoken";

export const authModerator = (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({ success: false, message: "Moderator not authenticated" });
    }

    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!tokenVerified) {
        return res.status(400).json({ success: false, message: "Moderator not authenticated" });
    }

    if (tokenVerified.role === "moderator") {

        return res.status(400).json({ message: "Moderator not authenticated" });
    }

    req.moderator = tokenVerified;
    next();

};

