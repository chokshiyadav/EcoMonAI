import express from "express";
import { pushDataToInflux } from "../controllers/pushToInfluxController.js";

const router = express.Router();

router.post("/", pushDataToInflux);

export default router;