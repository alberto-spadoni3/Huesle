import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: String,
    profilePicID: {
        type: Number,
        default: 0,
    },
    darkMode: {
        type: Boolean,
        default: true,
    },
    colorblindMode: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

export const UserModel = mongoose.model("User", userSchema, "users");
