import mongoose from "mongoose";
import {GameStates} from "./gameLogic.js";

const { Schema } = mongoose;

const matchSchema = new Schema({
    players: {
        type: [String],
        required: true,
        validate: [n_players_checker, 'Wrong number of players']
    },
    status: {
        type: GameStates.prototype,
        required: true
    },
    turn: {
        type: Number,
        required: true,
    },
    attempts: {
        type: [],
        required: false
    },
    solution: {
        type: [],
        required: true
    },
    date: Date
});

function n_players_checker(val) {
    return val.length == 2;
}

export const MatchModel = mongoose.model("Match", matchSchema, 'matches');
