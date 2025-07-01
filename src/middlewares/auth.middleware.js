import jwt from 'jsonwebtoken';
import { statusCode } from '../utils/constants/statusCode';

const authenticate= (req, res, next)=>{
    const token= req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(statusCode.UNAUTHORIZED).json({message: 'Access deined. No token provided'});
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decoded;

        next();
        
    } catch (error) {
        return res.status(statusCode.UNAUTHORIZED).json({message: 'Invalid or expired token'});
    }
};

export default authenticate;