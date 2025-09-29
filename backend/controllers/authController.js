import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import eventModel from "../models/eventModel.js";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../logger/logger.js'; // Assume a logger utility is available

dotenv.config();

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            logger.warn('Registration failed: Missing required fields', { name, email, phone });
            return res.status(400).send({ error: "Enter all the details" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            logger.info('Attempt to register an already existing user', { email });
            return res.send({
                success: true,
                message: "User already registered"
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, password: hashedPassword }).save();

        logger.info('User registered successfully', { userId: user._id, email });

        res.send({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        logger.error('Error during user registration', { error });
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        logger.info('Login attempt', { email });

        if (!email || !password) {
            logger.warn('Login failed: Missing email or password', { email });
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            logger.warn('Login failed: Email not registered', { email });
            return res.status(400).send({
                success: false,
                message: "Email is not registered"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            logger.warn('Login failed: Invalid password', { email });
            return res.status(400).send({
                success: false,
                message: "Invalid password"
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        logger.info('User logged in successfully', { userId: user._id, email });

        res.send({
            success: true,
            message: "Logged in successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                _id: user._id,
            },
            token
        });

    } catch (error) {
        logger.error('Error during login', { error });
        res.status(500).send({
            success: false,
            message: "Error in login",
            error: error.message || error,
        });
    }
};

export const participateController = async (req, res) => {
    try {
        const { eid } = req.params;
        logger.info('Participation request', { userId: req.user._id, eventId: eid });

        const event = await eventModel.findById(eid);
        let eventUsers = event.users;
        const oldUser = await userModel.findById(req.user._id);
        let userEvents = oldUser.events;

        for (let i = 0; i < userEvents.length; i++) {
            if (userEvents[i]._id.equals(event._id)) {
                logger.info('User already registered for event', { userId: req.user._id, eventId: eid });
                return res.status(200).send({
                    success: true,
                    message: 'Already registered for the event'
                });
            }
        }

        userEvents.push(event);
        const user = await userModel.findByIdAndUpdate(req.user._id, { events: userEvents }, { new: true }).populate('events');
        eventUsers.push(user);
        const updatedEvent = await eventModel.findByIdAndUpdate(event._id, { users: eventUsers }, { new: true });

        logger.info('User registered for event successfully', { userId: req.user._id, eventId: eid });

        res.status(200).send({
            success: true,
            message: "Registered for the event successfully",
            user
        });

    } catch (error) {
        logger.error('Error during event participation', { userId: req.user._id, error });
        res.status(500).send({
            success: false,
            message: "Error has occurred"
        });
    }
};

export const getParticipatedEventsController = async (req, res) => {
    try {
        logger.info('Fetching participated events', { userId: req.user._id });

        const user = await userModel.findById(req.user._id);
        const events = user.events;

        logger.info('Fetched participated events successfully', { userId: req.user._id, eventCount: events.length });

        res.status(200).send({
            success: true,
            events
        });

    } catch (error) {
        logger.error('Error fetching participated events', { userId: req.user._id, error });
        res.status(500).send({
            success: false,
            message: "Error while getting participated events"
        });
    }
};
