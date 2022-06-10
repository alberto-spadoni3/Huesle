import mongoose from "mongoose";

const { Schema } = mongoose;

const guessSchema = new Schema({
    playerId: {
        type: String,
        required: true
    },
   sequence: {
        type: [],
        required: true
    },
    rightPositions: {
        type: Number,
        required: true
    },
    rightColours: {
        type: Number,
        required: true
    },
    date: Date
});



export const GuessModel = mongoose.model("Guess", guessSchema, 'guesses');
