import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema({
    name: String,
    desc: String,
    img:
        {
            data: Buffer,
            contentType: String
        }
});

export const ImageModel = mongoose.model("Image", imageSchema, 'images');