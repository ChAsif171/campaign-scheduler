
import express from "express";
import {
    updateCampaignSchedule,
    getSchedules,
    createSchedule,
    deleteSchedule
} from "../controllers/schedulerController.js";

const router = express.Router();

router.post("/schedule", createSchedule);
router.get("/schedules", getSchedules);
router.put("/schedule/:campaignId", updateCampaignSchedule);
router.delete("/schedule/:campaignId", deleteSchedule);

export default router;
