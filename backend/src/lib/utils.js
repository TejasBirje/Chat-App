import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    // create a token
    // 	The payload — data you're embedding in the token (in this case, the user's ID).
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // in milliseconds
        httpOnly: true, // prevents XSS attacks, cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}