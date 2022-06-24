import express from "express";
import cors from "./middlewares/cors.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rootRoutes from "./routes/rootRoute.js";
import gameRoutes from "./routes/gameRoute.js";
import userRoutes from "./routes/userRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import mongoose from "mongoose";

//TRIAL
import './middlewares/fileUploader.js';
import './middlewares/socketHandler.js';

const port = 8080;
const app = express();

app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", rootRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/setting", settingRoutes);

const DB_URL = "mongodb://localhost:27017";

mongoose
    .connect(DB_URL, { dbName: "huesle" })
    .then(() => {
        console.log("DB ready");
        // the server start listening only after the DB is up and running
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch((error) => console.log(error.message));
