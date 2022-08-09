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
        state: {
            type: GameStates.prototype,
            required: true
        },
        player: {
            type: String,
        },
        turn: {
            type: Number,
            required: true,
        },
        abandoned: {
            type: Boolean
        }
    },
    attempts: {
        type: [],
        required: false
    },
    solution: {
        type: [],
        required: true
    },
    date: Date,
});

function status_checker(val) {
    return (val.status.state == GameStates.WINNER || val.status.state == GameStates.PLAYING) ||
        (val.status.state == GameStates.DRAW);
}

function n_players_checker(val) {
    return val.length == 2;
}

export const MatchModel = mongoose.model("Match", matchSchema, 'matches');
