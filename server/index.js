import express from "express";
import cors from "./middlewares/cors.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rootRoute from "./routes/rootRoute.js";
import gameRoutes from "./routes/gameRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { verifyJWT } from "./middlewares/verifyJWT.js";

//TRIAL
import "./middlewares/socketHandler.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", rootRoute);
app.use("/user", userRoutes);
app.use(verifyJWT);
app.use("/game", gameRoutes);
app.use("/search", searchRoutes);
app.use("/stats", statsRoutes);
app.use("/setting", settingRoutes);

try {
    mongoose.connect(process.env.MONGODB_URL, { dbName: "huesle" }, () => {
        console.log("DB ready");
        // the server start listening only after the DB is up and running
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    });
} catch (error) {
    console.log(error.message);
}
