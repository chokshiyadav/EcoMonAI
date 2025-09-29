import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";
import logger from '../logger/logger.js'; // Assume a logger utility is available

export const createEventController = async (req, res) => {
    try {
        const { title, description, place, date, time } = req.body;
        const organiser = req.user._id;

        if (!title || !description || !place || !date || !time || !organiser) {
            logger.warn('Event creation failed: Missing required fields', { organiser, title });
            return res.status(400).send({
                success: false,
                message: "Give all the details"
            });
        }

        const event = await new eventModel({ title, description, place, date, organiser, time }).save();

        logger.info('Event created successfully', { eventId: event._id, organiser });
        res.send({
            success: true,
            message: "Added event",
            event,
        });
    } catch (error) {
        logger.error('Error in creating event', { error });
        res.status(500).send({
            message: 'Error in organising an event',
            success: false,
            error
        });
    }
};

export const getAllEventsController = async (req, res) => {
    try {
        logger.info('Fetching all events');
        const events = await eventModel.find({});

        logger.info('Successfully fetched all events', { eventCount: events.length });
        res.status(200).send({
            success: true,
            message: "Successfully fetched all the events",
            events
        });
    } catch (error) {
        logger.error('Error while fetching all events', { error });
        res.status(500).send({
            success: false,
            message: "Error while fetching events"
        });
    }
};

export const getEventController = async (req, res) => {
    try {
        const { title } = req.params;
        logger.info('Fetching event by title', { title });

        const event = await eventModel.findOne({ title });

        if (!event) {
            logger.warn('Event not found', { title });
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        logger.info('Successfully fetched event', { eventId: event._id });
        res.status(200).send({
            success: true,
            message: "Successfully fetched the event",
            event,
        });
    } catch (error) {
        logger.error('Error while fetching event by title', { error });
        res.status(500).send({
            success: false,
            message: "Error while fetching event"
        });
    }
};

export const removeEventFromUserController = async (req, res) => {
    try {
        const { title } = req.params;
        logger.info('Removing event from user', { userId: req.user._id, title });

        const event = await eventModel.findOne({ title });
        if (!event) {
            logger.warn('Event not found while trying to remove from user', { title });
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        const user = await userModel.findById(req.user._id);
        const userEvents = user.events;

        const eventIndex = userEvents.findIndex((e) => e._id.equals(event._id));
        if (eventIndex === -1) {
            logger.warn('Event not associated with user', { userId: req.user._id, eventId: event._id });
            return res.status(400).send({
                success: false,
                message: "Event not associated with user"
            });
        }

        userEvents.splice(eventIndex, 1);
        await userModel.findByIdAndUpdate(user._id, { events: userEvents }, { new: true });

        logger.info('Event removed from user successfully', { userId: req.user._id, eventId: event._id });
        res.send({
            success: true,
            message: "Successfully deleted event",
        });
    } catch (error) {
        logger.error('Error while removing event from user', { error });
        res.status(500).send({
            success: false,
            message: "Error while deleting event"
        });
    }
};

export const getHostedEventsController = async (req, res) => {
    try {
        logger.info('Fetching hosted events for user', { userId: req.user._id });

        const events = await eventModel.find({ organiser: req.user._id });

        logger.info('Successfully fetched hosted events', { userId: req.user._id, eventCount: events.length });
        res.status(200).send({
            success: true,
            events
        });
    } catch (error) {
        logger.error('Error while fetching hosted events', { userId: req.user._id, error });
        res.status(500).send({
            success: false,
            message: "Error while fetching hosted events"
        });
    }
};

export const getEventUsersController = async (req, res) => {
    try {
        const { eid } = req.params;
        logger.info('Fetching users for event', { eventId: eid });

        const event = await eventModel.findById(eid);
        if (!event) {
            logger.warn('Event not found while fetching users', { eventId: eid });
            return res.status(404).send({
                success: false,
                message: "Event not found"
            });
        }

        const eventUsers = event.users;
        console.log(eventUsers);

        // logger.info('Successfully fetched users for event', { eventId: eid, userCount: eventUsers.length });
        res.status(200).send({
            success: true,
            eventUsers
        });
    } catch (error) {
        logger.error('Error while fetching users for event', { eventId: eid, error });
        res.status(500).send({
            success: false,
            message: "Error while fetching users of event"
        });
    }
};
