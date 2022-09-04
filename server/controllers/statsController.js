import { GameStates } from "../model/gameLogic.js";
import { UserModel } from "../model/UserModel.js";
import { MatchModel } from "../model/MatchModel.js";
import { PendingRequestModel } from "../model/PendingRequestModel.js";
import {NotificationModel} from "../model/NotificationModel.js";
import {findUserId} from "./utilityFunctions.js";

const getActiveMatchesOfUser = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if (!requesterId)
        return res.status(400).json({
            message: "Username not valid",
        });
    const matches = await MatchModel.find(
        {
            status: { state: GameStates.PLAYING, player: requesterId },
        },
        "_id"
    );
    res.status(200).json({
        matches: matches,
    });
};

const getAllMatchesOfUser = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if (!requesterId)
        return res.status(400).json({
            message: "Username not valid",
        });
    const matches = await MatchModel.find({ players: { $in: [requesterId] } }, [
        "_id",
        "status",
        "players",
    ]);
    for (let match of matches) {
        let players_names = [];
        for (let id in match.players) {
            const name = await UserModel.findById(match.players[id], [
                "username",
            ]);
            if (match.status.player == match.players[id])
                match.status.player = name.username;
            players_names.push(name.username);
        }
        match.players = players_names;
    }
    const pending = await PendingRequestModel.findOne({
        playerId: requesterId,
    });
    res.status(200).json({
        pending: pending != null,
        matches: matches,
    });
};

const getOngoingMatches = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if (!requesterId)
        return res.status(400).json({
            message: "Username not valid",
        });
    const matches = await MatchModel.find(
        { players: requesterId, status: { state: GameStates.PLAYING } },
        "_id"
    );
    res.status(200).json({
        matches: matches,
    });
};

const getUserStats = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if (!requesterId)
        return res.status(400).json({
            message: "Username not valid",
        });
    const matches_won = await MatchModel.find({
        "status.state": GameStates.WINNER,
        "status.player": requesterId,
    }).count();
    const matches_lost = await MatchModel.find({
        "status.state": GameStates.WINNER,
        "status.player": { $ne: requesterId },
    }).count();
    const matches_drawn = await MatchModel.find({
        players: requesterId,
        "status.state": GameStates.DRAW,
    }).count();
    res.status(200).json({
        matches_won: matches_won,
        matches_lost: matches_lost,
        matches_drawn: matches_drawn,
    });
};

const getNotifications = async (req, res) => {
    const userID = await findUserId(req.username);
    if (!userID)
        return res.status(400).json({
            message: "Username not valid",
        });

    const newNotification = await NotificationModel.find({
        userID: userID,
        read: false,
    }).sort('-date');

    const readNotification = await NotificationModel.find({
        userID: userID,
        read: true,
    }).sort({'date': -1}).limit(5);

    res.status(200).json({
        notifications: newNotification.concat(readNotification)
    });
};

const areNewNotifications = async (req, res) => {
    const userID = await findUserId(req.username);
    if (!userID)
        return res.status(400).json({
            message: "Username not valid",
        });

    const newNotification = await NotificationModel.findOne({
        userID: userID,
        read: false,
    });

    res.status(200).json({
        newNotification: newNotification? true: false
    });
};

const signalNotificationsRead = async (req, res) => {
    const { date } = req.body;
    const userID = await findUserId(req.username);
    if (!userID)
        return res.status(400).json({
            message: "Username not valid",
        });
    const notifications = await NotificationModel.find({
        userID: userID,
        read: false,
        date: {$lte: date}
    });

    for (let index in notifications) {
        notifications[index].read = true;
        notifications[index].save();
    }

    res.sendStatus(200);
};

export const statsController = {
    getActiveMatchesOfUser,
    getOngoingMatches,
    getAllMatchesOfUser,
    getUserStats,
    getNotifications,
    areNewNotifications,
    signalNotificationsRead
};
