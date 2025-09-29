import bcrypt from 'bcryptjs';
import logger from '../logger/logger.js';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        logger.info('Password hashed successfully'); // Logging success
        return hashedPassword;
    } catch (error) {
        logger.error('Error while hashing password:', error); // Logging error
        throw new Error('Password hashing failed');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
            logger.info('Passwords match'); // Logging success when passwords match
        } else {
            logger.info('Passwords do not match'); // Logging when passwords do not match
        }
        return isMatch;
    } catch (error) {
        logger.error('Error while comparing passwords:', error); // Logging error
        throw new Error('Password comparison failed');
    }
};

