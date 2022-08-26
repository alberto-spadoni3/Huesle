import mongoose from "mongoose";

const { Schema } = mongoose;

const resetPasswordTokenSchema = new Schema({
    expireAt: {
        type: Date,
    },
    token: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
});

resetPasswordTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const ResetPasswordTokenModel = mongoose.model("ResetPasswordToken", resetPasswordTokenSchema, 'resetPasswordTokens');
