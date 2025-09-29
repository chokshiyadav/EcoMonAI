import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

import logger from '../logger/logger.js';

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            logger.warn('Authorization token not found in headers'); // Log when token is missing
            return res.status(401).send({
                success: false,
                message: 'No token provided, access denied',
            });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        logger.info('Token verified successfully'); // Log after successful verification
        next();
    } catch (error) {
        logger.error('Error in requireSignIn middleware:', error); // Log error
        res.status(401).send({
            success: false,
            message: 'Invalid token, authentication failed',
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        logger.info('isAdmin middleware called'); // Log function call

        const user = await userModel.findById(req.user._id);
        if (!user) {
            logger.warn('User not found'); // Log if user does not exist
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        if (user.role !== 1) {
            logger.warn(`User ${user._id} is not an admin`); // Log when user is not admin
            return res.send({
                success: false,
                message: 'Unauthorized access',
            });
        }

        logger.info(`User ${user._id} is an admin`); // Log when user is an admin
        next();
    } catch (error) {
        logger.error('Error in isAdmin middleware:', error); // Log error
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
};
