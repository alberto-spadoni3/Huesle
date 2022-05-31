import mongoose from 'mongoose';
import express from "express";
import router from "../routes/rootRoute.js";

const DB_URL = "mongodb+srv://pollo:pollo@cluster0.215aibe.mongodb.net/?retryWrites=true&w=majority";

const port = 8080;
const app = express();

mongoose.connect(DB_URL, {dbName: "huesle"})
    .then(() => {
        console.log(`Successfully connected to the database listening on port ${port}`);
        })
    .catch((error) => console.log(error.message));

class DbManager {

    registerUser (username, hashedpswd, email) {
        const schema = new mongoose.Schema({username: 'string', hashedpswd: 'string', email: 'string'});
        const User = mongoose.model('User', schema, 'user');
        let user = new User();
        user.username = username;
        user.hashedpswd = hashedpswd;
        user.email = email;
        return user.save();
    }
}

export default new DbManager();
