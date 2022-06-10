import mongoose from "mongoose";

const { Schema } = mongoose;

const pendingRequestSchema = new Schema({
    playerId: {
        type: String,
        required: true,
    },
    secretCode: {
        type: String,
        required: false,
        unique: true,
    }
});

export const PendingRequestModel = mongoose.model("PendingRequest", pendingRequestSchema, 'pendingRequests');
