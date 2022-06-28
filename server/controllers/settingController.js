import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";

const updatePassword = async (req, res) => {
    const { username, prevPassword, newPassword } = req.body;

    const userInDB = await UserModel.findOne({ username });
    if (!userInDB) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(prevPassword, userInDB.password);
    if (match) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userInDB.password = hashedPassword;
        await userInDB.save();
        res.status(200).json({ message: "Password updated" });
    } else {
        return res
            .status(400)
            .json({ message: "The old password is wrong! No update is made." });
    }
};

const updateUsername = async (req, res) => {
    const currentUsername = req.username;
    const { newUsername } = req.body;

    const possibleDuplicateUsername = await UserModel.where("username").equals(
        newUsername
    );

    if (possibleDuplicateUsername.length > 0)
        return res
            .status(409)
            .json({ message: "The username is already in use" });

    const userInDB = await UserModel.findOne({ currentUsername });
    userInDB.username = newUsername;
    await userInDB.save();
    res.status(200).json({ message: "Username updated" });
};

const getSettings = async (req, res) => {
    const username = req.username;

    if (!username) {
        return res.sendStatus(401);
    }

    const userInDB = await UserModel.findOne({ username });
    if (!userInDB) {
        return res.sendStatus(401);
    }

    res.status(200).json({
        darkMode: userInDB.darkMode,
        colorblindMode: userInDB.colorblindMode,
    });
};

const updateSettings = async (req, res) => {
    const username = req.username;
    const { darkMode, colorblindMode } = req.body;

    const userDB = await UserModel.findOne({ username: username }, [
        "darkMode",
        "colorblindMode",
    ]);
    if (!userDB) {
        return res.sendStatus(401);
    }
    userDB.darkMode = darkMode;
    userDB.colorblindMode = colorblindMode;
    await userDB.save();
    res.sendStatus(200);
};

const updateProfilePic = async (req, res) => {
    const username = req.username;
    const { picName } = req.body;
    const image = await ImageModel.find({ name: picName });
    const userInDB = await UserModel.findOne({ username: username });
    if (!userInDB || image) {
        return res.sendStatus(401);
    }
    userInDB.profilePicName = picName;
    await userDB.save();
    res.sendStatus(200);
};

const getAvailableProfilePics = async (req, res) => {
    const images = await ImageModel.find();
    res.status(200).json({
        images: images,
    });
};

export const settingController = {
    updatePassword,
    updateUsername,
    getSettings,
    updateSettings,
    getAvailableProfilePics,
    updateProfilePic,
};
