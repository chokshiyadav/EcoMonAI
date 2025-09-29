import express from 'express';
import { createEventController,getAllEventsController,getEventController, getEventUsersController, getHostedEventsController, removeEventFromUserController } from '../controllers/eventController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/create-event',requireSignIn,createEventController);

router.get('/get-events',getAllEventsController);

router.get('/getOneEvent/:title',getEventController);

router.delete('/remove-event/:title',requireSignIn, removeEventFromUserController);

router.get('/geteventusers/:eid',requireSignIn,getEventUsersController)

router.get('/get-hostedEvents',requireSignIn,getHostedEventsController)

export default router;