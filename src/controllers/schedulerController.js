
import schedulerService from "../jobs/scheduler.js";
import { HttpStatusCode } from "../constants/index.js";
import { tryCatchWrapper } from "../utils/Errorhandler.js";

const updateCampaignSchedule = tryCatchWrapper(async (req, res) => {
    const { campaignId } = req.params;
    const { cronExpression } = req.body;

    if (!campaignId || !cronExpression) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "campaignId and cronExpression are required"
        });
    }

    const result = await schedulerService.updateSchedule(campaignId, cronExpression);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: result,
        message: "Schedule updated successfully"
    });
});

const getSchedules = tryCatchWrapper(async (req, res) => {
    const filters = req.query;
    const schedules = await schedulerService.getSchedules(filters);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: schedules,
        count: schedules.length,
        message: "Schedules fetched successfully"
    });
});

const createSchedule = tryCatchWrapper(async (req, res) => {
    const { campaignId, cronExpression, taskData } = req.body;

    if (!campaignId || !cronExpression) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "campaignId and cronExpression are required"
        });
    }

    await schedulerService.scheduleCampaign(campaignId, cronExpression, taskData);

    res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Campaign scheduled successfully"
    });
});

const deleteSchedule = tryCatchWrapper(async (req, res) => {
    const { campaignId } = req.params;

    await schedulerService.deleteSchedule(campaignId);

    res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Schedule deleted successfully"
    });
});

export {
    updateCampaignSchedule,
    getSchedules,
    createSchedule,
    deleteSchedule
};
