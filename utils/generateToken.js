import jwt from "jsonwebtoken";

export const generateToken = (email, role, shopName) => {
console.log(shopName )
    const token = jwt.sign({ email: email, role: role || 'user', shopName: shopName || 'unknown' }, process.env.JWT_SECRET_KEY);

    return token;
};


 