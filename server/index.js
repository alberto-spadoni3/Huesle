import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import rootRoutes from './routes/rootRoute.js';

const port = 8080;
const app = express();
const DB_URL = "mongodb://localhost/test";

mongoose.connect(DB_URL, { useNewUrlParser: true})
    .then(() => {
        console.log("Successfully connected to the database")
        
        // Una volta connessi al database, è possibile mettere il server in ascolto
        app.listen(port, () => console.log(`Server listening on port ${port}`))
    })
    .catch((error) => console.log(error.message));

app.use('/', rootRoutes);
