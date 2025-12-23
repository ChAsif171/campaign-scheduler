import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

// will apply to all requests incoming to the app
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(cors());
app.use(helmet());
app.use(morgan(":method :url :status :response-time :res[content-length] :date[iso]", {
    skip: (req, res) => req.url === "/",
}));

export default app;
