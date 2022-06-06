import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rootRoutes from "./routes/rootRoute.js";
import gameRoutes from "./routes/gameRoute.js";
import userRoutes from "./routes/userRoutes";
import http from "http";

const port = 8080;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", rootRoutes);
app.use("/game", gameRoutes);
app.use("7user", userRoutes);

const server = http.createServer(app);
server.listen(port);
