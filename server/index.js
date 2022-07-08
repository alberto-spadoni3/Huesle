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
import "./middlewares/fileUploader.js";
import "./middlewares/socketHandler.js";

const port = 8080;
const app = express();
dotenv.config();

app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", rootRoute);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/search", searchRoutes);
app.use("/stats", statsRoutes);
app.use(verifyJWT);
app.use("/setting", settingRoutes);

const DB_URL = "mongodb://localhost:27017";

try {
    mongoose
        .connect(DB_URL, {dbName: "huesle"}, () => {
            console.log("DB ready");
            // the server start listening only after the DB is up and running
            app.listen(port, () => console.log(`Server listening on port ${port}`));
        })
} catch(error) {
    console.log(error.message)
};

