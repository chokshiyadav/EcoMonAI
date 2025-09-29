import express from 'express';
import { getParticipatedEventsController, loginController, participateController, registerController } from '../controllers/authController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerController);

router.post("/login",loginController);

router.put('/participate/:eid',requireSignIn,participateController)

router.get('/your-participations',requireSignIn,getParticipatedEventsController)

export default router;