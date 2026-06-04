import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        const user = await User.findById(decode.userId).select("_id role banned");
        if (!user) {
            return res.status(401).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({
                message: "User not found",
                success: false
            });
        }
        if (user.banned) {
            return res.status(403).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({
                message: "Your account has been banned. Please contact support.",
                success: false
            });
        }
        req.id = decode.userId;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
}
export default isAuthenticated;
