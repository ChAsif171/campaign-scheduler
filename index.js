import { globalErrorHandlerMiddleware, handleApiNotFound, handleSIGINT, handleUncaughtException } from "./src/utils/globalErrorHandlers.js";
import "./src/jobs/index.js";
import app from "./src/middlewares/appRouteMiddlewares.js";
import schedulerRoutes from "./src/routes/schedulerRoutes.js";
import print from "./src/utils/print.js";

app.use("/api/v1", schedulerRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// route not found
app.use(handleApiNotFound);

// error handler
app.use(globalErrorHandlerMiddleware);

// uncaughtException and unhandledRejection
process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUncaughtException);

// If node exits, terminate mongoose connection
process.on("SIGINT", handleSIGINT);

app.listen(process.env.PORT || 3000, () => {
    print("info", `Stable is running on port ${process.env.PORT}...`);
    print("info", `This is ${process.env.NODE_ENV} environment...`);
});
