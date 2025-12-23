import redisClient from "../../config/redis.js";

async function setToCache(key, value) {
    try {
        const isExists = await redisClient.set(key, value);
        return isExists;
    } catch (error) {
        throw new Error(error.message);
    }
}
export default setToCache;
