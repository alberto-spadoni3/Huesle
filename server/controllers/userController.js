import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResetPasswordTokenModel } from "../model/ResetPasswordTokenModel.js";
import nodemailer from "nodemailer";

const ACCESS_TOKEN_EXPIRES_IN = "10m";
const REFRESH_TOKEN_EXPIRES_IN = "1d";

const handleUserRegistration = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({
            message: "Username, password and email are all required.",
        });
    }

    // check for duplicate email
    const possibleDuplicateEmail = await UserModel.where("email").equals(email);
    if (possibleDuplicateEmail.length > 0)
        return res
            .status(409)
            .json({ message: "The email address is already in use" });

    // check for duplicate username
    const possibleDuplicateUser = await UserModel.where("username").equals(
        username
    );
    if (possibleDuplicateUser.length > 0)
        return res
            .status(409)
            .json({ message: "The username is already in use" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // store the new user in the database
        const userToSave = {
            email,
            username,
            password: hashedPassword,
        };

        const newUser = new UserModel(userToSave);
        await newUser.save();

        res.status(201).json({
            message: `User ${username} created successfully.`,
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const handleUserLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are both required.",
        });
    }

    const userInDB = await UserModel.findOne({ username });
    if (!userInDB) {
        return res.sendStatus(401);
    }

    // checking the password
    const match = await bcrypt.compare(password, userInDB.password);
    if (match) {
        // create the access and refresh tokens
        const accessToken = jwt.sign(
            {
                email: userInDB.email,
                username: userInDB.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            {
                email: userInDB.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );

        // save the refresh token in the DB
        userInDB.refreshToken = refreshToken;
        await userInDB.save();

        // send the refresh token as an HTTP-only cookie
        const maxAge = 24 * 60 * 60 * 1000; // one day expressed in milliseconds
        res.cookie("jwtRefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: maxAge,
        });

        // send the access token as a JSON object
        res.status(200).json({
            accessToken,
            profilePicID: userInDB.profilePicID,
        });
    } else {
        res.sendStatus(401);
    }
};

const refreshAccessToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtRefreshToken) return res.sendStatus(401);

    const refreshToken = cookies.jwtRefreshToken;

    // checking if there is a user with that refresh token associated
    const userInDB = await UserModel.findOne({ refreshToken });
    if (!userInDB) {
        return res.sendStatus(403);
    }

    const { email, username, profilePicID } = userInDB;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, _) => {
        if (error) {
            return res.sendStatus(403);
        }

        const newAccessToken = jwt.sign(
            {
                email,
                username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );
        res.json({ username, newAccessToken, profilePicID });
    });
};

const handleUserLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtRefreshToken) return res.sendStatus(204);
    const refreshToken = cookies.jwtRefreshToken;

    // clear the cookie on the client
    res.clearCookie("jwtRefreshToken", {
        httpOnly: true,
    });

    const userInDB = await UserModel.findOne({ refreshToken });
    if (!userInDB) return res.sendStatus(204);

    // now we delete the refresh token stored in the DB
    userInDB.refreshToken = undefined;
    await userInDB.save();
    res.status(200).json({
        message: `The user ${userInDB.username} is successfully logged out`,
    });
};

const handleResetPasswordRequest = async (req, res) => {
    const { username, email } = req.query;

    const userInDB = await UserModel.findOne({
        username: username,
        email: email,
    });
    if (!userInDB)
        return res.status(404).json({
            message: `An account with these fields doesn't exist`,
        });
    const userID = userInDB._id.toString();

    var date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    var expiringDate = new Date(date);

    const token = await bcrypt.hash(
        userID + date.toString() + Math.floor(Math.random() * 1000),
        10
    );

    const requestAlreadyPresent = await ResetPasswordTokenModel.findOne({
        userID: userID,
    });
    if (requestAlreadyPresent)
        return res.status(405).json({
            message: `An email has already been sent to that address`,
        });

    await ResetPasswordTokenModel.create({
        userID: userID,
        token: token,
        expireAt: expiringDate,
    });

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.NODEMAILER_PORT,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
        from: "Huesle <" + process.env.NODEMAILER_EMAIL + ">",
        to: email,
        subject: "Huesle Reset Password Request",
        text:
            "Do not respond to this email! Use the following link to reset your password:\n" +
            req.protocol +
            "://" +
            req.hostname +
            "/resetPassword?token=" +
            token +
            "\n" +
            "The link will expire in 10 minutes.",
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
};

const checkResetPasswordToken = async (req, res) => {
    const { token } = req.body;

    const request = await ResetPasswordTokenModel.findOne({ token });
    if (!request) return res.sendStatus(404);

    const userInDB = await UserModel.findById(request.userID, ["username"]);

    return res.status(200).json({
        username: userInDB.username,
    });
};

const resetPassword = async (req, res) => {
    const { token, username, password } = req.body;

    const userInDB = await UserModel.findOne({ username }, ["_id"]);
    if (!userInDB) {
        return res.sendStatus(401);
    }
    const userID = userInDB._id.toString();
    const tokenCheck = await ResetPasswordTokenModel.findOne({ userID });
    if (!tokenCheck) {
        return res.sendStatus(401);
    }

    tokenCheck.deleteOne();

    const hashedPassword = await bcrypt.hash(password, 10);
    userInDB.password = hashedPassword;
    await userInDB.save();
    res.status(200).json({ message: "Password updated" });
};

export const userController = {
    handleUserRegistration,
    handleUserLogin,
    refreshAccessToken,
    handleUserLogout,
    handleResetPasswordRequest,
    checkResetPasswordToken,
    resetPassword,
};
