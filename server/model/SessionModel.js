import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    }
});

export const UserModel = mongoose.model("User", userSchema, "users");
