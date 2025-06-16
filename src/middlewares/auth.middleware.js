import jwt from 'jsonwebtoken';
import { statusCode } from '../../utils/constants/statusCode.js';

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(statusCode.UNAUTHORIZED).json({ message: 'Access Denied. No token Provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(statusCode.UNAUTHORIZED).json({ message: 'Invalid or Expired Token' });
    }
};

export default authenticate;
