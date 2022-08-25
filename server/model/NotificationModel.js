import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    matchId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    }
});

export const NotificationModel = mongoose.model("Notification", notificationSchema, 'notifications');
