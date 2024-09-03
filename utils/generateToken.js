import jwt from "jsonwebtoken";

export const generateToken = (email, role, shopName='') => {

    const token = jwt.sign({ email: email, role: role || 'user', shopName }, process.env.JWT_SECRET_KEY);

    return token;
};


