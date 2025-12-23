import BaseError from "./BaseError.js";
import logger from "../logger/index.js";

class ErrorHandler {
    handleError(err) {
        logger.error(`${err?.httpCode} ::  ${err?.name} :: ${err?.message}`);
        if (err.err?.httpCode) {
            logger.error(JSON.stringify(err?.stack));
        }
    }

    handleUncaughtException(error) {
        logger.error(
            `Uncaught Exception: ${error}`,
            error,
        );
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

const errorHandler = new ErrorHandler();

const tryCatchWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { tryCatchWrapper };
export default errorHandler;
