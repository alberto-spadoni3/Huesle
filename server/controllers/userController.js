import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleUserRegistration = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({
            message: "Username, password and email are all required.",
        });
    }

    // check for duplicate username
    const possibleDuplicateUser = await UserModel.where("username").equals(
        username
    );
    if (possibleDuplicateUser.length > 0)
        return res.status(409).json({ message: "The username already exists" });

    // check for duplicate email
    const possibleDuplicateEmail = await UserModel.where("email").equals(email);
    if (possibleDuplicateEmail.length > 0)
        return res
            .status(409)
            .json({ message: "The email address already exists" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // store the new user in the database
        const userToSave = {
            email: email,
            username: username,
            password: hashedPassword,
        };

        const newUser = new UserModel(userToSave);
        await newUser.save();

        res.status(201).json({
            message: `User ${username} created successfully.`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const handleUserLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are both required.",
        });
    }

    const userInDB = await UserModel.findOne({ username: `${username}` });
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
            "secret",
            { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
            {
                email: userInDB.email,
                username: userInDB.username,
            },
            "secret-refresh",
            { expiresIn: "1d" }
        );

        // save the refresh token in the DB
        userInDB.refreshToken = refreshToken;
        const tokenSavingResult = await userInDB.save();
        if (tokenSavingResult) {
            console.log("refresh token saved to the DB");
        } else {
            console.log("Problems while saving the refresh token into the DB");
        }

        // send the refresh token as an HTTP-only cookie
        const maxAge = 24 * 60 * 60 * 1000; // one day expressed in milliseconds
        res.cookie("jwtRefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: maxAge,
        });

        // send the access token as a JSON object
        res.status(200).json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};

const refreshAccessToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtRefreshToken) return res.sendStatus(401);

    const refreshToken = cookies.jwtRefreshToken;

    // checking if there is a user with that refresh token associated
    const userInDB = await UserModel.findOne({
        refreshToken: `${refreshToken}`,
    });
    if (!userInDB) {
        res.sendStatus(403);
    }

    jwt.verify(refreshToken, "secret-refresh", (error, decodedRefreshToken) => {
        if (error || userInDB.username !== decodedRefreshToken.username) {
            return res.sendStatus(403);
        }
        const newAccessToken = jwt.sign(
            {
                email: decodedRefreshToken.email,
                username: decodedRefreshToken.username,
            },
            "secret",
            { expiresIn: "10m" }
        );
        res.json({ username: userInDB.username, newAccessToken });
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

    const userInDB = await UserModel.findOne({
        refreshToken: `${refreshToken}`,
    });
    if (!userInDB) return res.sendStatus(204);

    // now we delete the refresh token stored in the DB
    userInDB.refreshToken = undefined;
    await userInDB.save();
    res.status(200).json({
        message: `The user ${userInDB.username} is successfully logged out`,
    });
};

export const userController = {
    handleUserRegistration,
    handleUserLogin,
    refreshAccessToken,
    handleUserLogout
};
