import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema({
    id: {
        type: Number,
    },
});

export const ImageModel = mongoose.model("Image", imageSchema, "images");
