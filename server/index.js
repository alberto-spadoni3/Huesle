import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rootRoutes from './routes/rootRoute.js';
import gameRoutes from './routes/gameRoute.js';
import http from "http";

const port = 8080;
const app = express();

app.use(express.json());
app.use('/', rootRoutes);
app.use('/game', gameRoutes);

const server = http.createServer(app);
server.listen(port);

import {createRandomSolutionWithRepetition, checkGuess} from "./model/gameLogic.js";
let solution = ["Red", "Red", "Blue", "Yellow"];
let attempt = ["Green", "Green", "Green", "Red"];
console.log(solution);
console.log(attempt);
console.log(checkGuess(attempt, solution));