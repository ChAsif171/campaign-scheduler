import dotenv from "dotenv";

dotenv.config({ path: `.env` });

export default {
    PORT: process.env.PORT,
    REDIS_CLOUD: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT,
        PASSWORD: process.env.REDIS_PASSWORD,
    },
}
