import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import gameRoutes from "./routes/gameRoute.js";
import userRoutes from "./routes/userRoutes.js";
import http from "http";
import mongoose from "mongoose";

const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use("/", userRoutes);
app.use("/game", gameRoutes);

const DB_URL = "mongodb://localhost:27017";

mongoose.connect(DB_URL, {dbName: "huesle"})
    .then(() => console.log("DB ready"))
    .catch((error) => console.log(error.message));

const server = http.createServer(app);
server.listen(port);
