import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rootRoutes from './routes/rootRoute.js';
import http from "http";

const port = 8080;
const app = express();


app.use('/', rootRoutes);
app.use(express.json());

app.set('port', port);
var server = http.createServer(app);
server.listen(port);