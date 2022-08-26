import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";

const updateEmail = async (req, res) => {
    const username = req.username;
    const { newEmail } = req.body;

    const userInDB = await UserModel.findOne({ username });
    if (!userInDB) return res.sendStatus(401);

    if (userInDB.email === newEmail)
        return res
            .status(409)
            .json({ message: "This email address is already in use" });

    userInDB.email = newEmail;
    await userInDB.save();
    res.status(200).json({ message: "Email address updated!" });
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
            .json({ message: "This username is already in use" });

    const userInDB = await UserModel.findOne({ username: currentUsername });
    userInDB.username = newUsername;
    await userInDB.save();
    res.status(200).json({ message: "Username updated!" });
};

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

    const userDB = await UserModel.findOneAndUpdate(
        { username },
        { darkMode, colorblindMode },
        { new: true } // tells the function to return the updated object
    );

    if (!userDB) {
        return res.sendStatus(401);
    }

    res.sendStatus(200);
};

const getUserPic = async (req, res) => {
    const username = req.username;

    const userPicID = await UserModel.findOne({ username }, "profilePicID");
    if (!userPicID) return res.sendStatus(402);

    res.status(200).json({ userPicID: userPicID.profilePicID });
};

const updateProfilePic = async (req, res) => {
    const username = req.username;
    const { profilePicID } = req.body;

    const userInDB = await UserModel.findOneAndUpdate(
        { username },
        { profilePicID },
        { new: true } // tells the function to return the updated object
    );

    if (!userInDB) {
        return res.sendStatus(401);
    }

    res.status(200).json({ message: "User picture updated" });
};

export const settingController = {
    updateEmail,
    updateUsername,
    updatePassword,
    getSettings,
    updateSettings,
    getUserPic,
    updateProfilePic,
};
