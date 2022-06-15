import bodyParser from "body-parser";
import {ImageModel} from "../model/ImageModel.js";
import fs from "fs";
import path from "path";

eraseImages();
const directoryPath = path.join('./', 'resources');

fs.readdir(directoryPath, function(err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    filenames.forEach(function(filename) {
        var obj = {
            name: filename,
            img: {
                data: fs.readFileSync(path.join(directoryPath , filename)),
                contentType: 'image/png'
            }
        }
        ImageModel.create(obj, (err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                item.save();
            }
        });
    });
});

async function eraseImages() {
    await ImageModel.deleteMany();
}