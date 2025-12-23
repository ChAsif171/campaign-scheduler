
import cron from "node-cron";
import redisClient from "../config/redis.js";
import logger from "../logger/index.js";

class SchedulerService {
    constructor() {
        this.tasks = new Map();
        this.REDIS_KEY_PREFIX = "campaign:schedule:";
    }
    async init() {
        logger.info("Initializing Scheduler Service...");
        try {
            const keys = await redisClient.keys(`${this.REDIS_KEY_PREFIX}*`);
            for (const key of keys) {
                const campaignId = key.replace(this.REDIS_KEY_PREFIX, "");
                const scheduleConfigStr = await redisClient.get(key);
                if (scheduleConfigStr) {
                    const config = JSON.parse(scheduleConfigStr);
                    this.scheduleCampaign(campaignId, config.cronExpression, config.taskData, false);
                }
            }
            logger.info(`Scheduler Service Initialized. Loaded ${this.tasks.size} schedules.`);
        } catch (error) {
            logger.error(`Error initializing scheduler: ${error.message}`);
        }
    }
    async scheduleCampaign(campaignId, cronExpression, taskData = {}, persist = true) {
        if (!cron.validate(cronExpression)) {
            throw new Error(`Invalid cron expression: ${cronExpression}`);
        }
        if (this.tasks.has(campaignId)) {
            logger.info(`Stopping existing task for campaign ${campaignId}`);
            this.tasks.get(campaignId).stop();
            this.tasks.delete(campaignId);
        }
        const task = cron.schedule(cronExpression, async () => {
            logger.info(`Executing campaign ${campaignId} at ${new Date().toISOString()}`);
            logger.info(`Campaign Data: ${JSON.stringify(taskData)}`);
        });

        this.tasks.set(campaignId, task);
        logger.info(`Scheduled campaign ${campaignId} with corn: ${cronExpression}`);

        if (persist) {
            await redisClient.set(
                `${this.REDIS_KEY_PREFIX}${campaignId}`,
                JSON.stringify({ cronExpression, taskData, updatedAt: new Date() })
            );
        }
    }
    async updateSchedule(campaignId, newCronExpression) {
        const key = `${this.REDIS_KEY_PREFIX}${campaignId}`;
        const existingConfigStr = await redisClient.get(key);

        if (!existingConfigStr) {
            throw new Error(`No schedule found for campaign ${campaignId}`);
        }

        const config = JSON.parse(existingConfigStr);
        await this.scheduleCampaign(campaignId, newCronExpression, config.taskData, true);
        return { campaignId, status: "updated", newCronExpression };
    }
    async getSchedules(filters = {}) {
        const schedules = [];
        const keys = await redisClient.keys(`${this.REDIS_KEY_PREFIX}*`);

        for (const key of keys) {
            const campaignId = key.replace(this.REDIS_KEY_PREFIX, "");
            const configStr = await redisClient.get(key);
            if (configStr) {
                const config = JSON.parse(configStr);
                const schedule = {
                    campaignId,
                    cronExpression: config.cronExpression,
                    lastUpdated: config.updatedAt,
                    isActive: this.tasks.has(campaignId)
                };
                if (filters.campaignId && filters.campaignId !== campaignId) continue;
                schedules.push(schedule);
            }
        }
        return schedules;
    }
    async deleteSchedule(campaignId) {
        if (this.tasks.has(campaignId)) {
            this.tasks.get(campaignId).stop();
            this.tasks.delete(campaignId);
        }
        await redisClient.del(`${this.REDIS_KEY_PREFIX}${campaignId}`);
        logger.info(`Deleted schedule for campaign ${campaignId}`);
    }
}

export default new SchedulerService();
