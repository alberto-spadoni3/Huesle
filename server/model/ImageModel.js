import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
            data: Buffer,
            contentType: String,
        }
});

export const ImageModel = mongoose.model("Image", imageSchema, 'images');