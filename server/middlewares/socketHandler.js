import { MatchModel } from "../model/MatchModel.js";
import { UserModel } from "../model/UserModel.js";
import {
    createRandomSolutionWithRepetition,
    createSolutionWithoutRepetition,
    GameStates,
} from "../model/gameLogic.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { NotificationModel } from "../model/NotificationModel.js";

const app = express();
const port = process.env.SOCKET_IO_PORT || 8081;
const httpServer = createServer(app);
const io = new Server(port, {
    upgrade: false,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
        transports: ["websocket"],
    },
});
io.attach(httpServer);

export class MessageTypes {
    static CONNECTION = "connection";
    static SESSION = "session";
    static NEW_MATCH = "new_match";
    static NEW_MOVE = "new_move";
    static MATCH_OVER = "match_over";
}

io.use((socket, next) => {
    if (!socket.handshake.auth.username) {
        socket.disconnect();
    } else {
        const username = socket.handshake.auth.username;
        fetchUsernameId(username).then((id) => {
            socket.userID = id;
            socket.username = username;
            next();
        });
    }

    socket.emit(MessageTypes.SESSION, {
        userID: socket.userID,
    });
});

io.on(MessageTypes.CONNECTION, (socket) => {
    socket.join(socket.userID);
    socket.emit(MessageTypes.SESSION, {
        userID: socket.userID,
    });
    connectUserToMatchSockets(socket.userID);
});

async function fetchUsernameId(username) {
    const id = await UserModel.findOne({ username: username }, "_id");
    if (!id) return;
    else return id._id.toString();
}

async function connectUserToMatchSockets(id) {
    const matches = await MatchModel.find(
        {
            players: id,
            "status.state": GameStates.PLAYING,
        },
        "_id"
    );
    matches.forEach((match) => {
        io.in(id).socketsJoin(match._id.toString());
    });
}

export function emitNewMatch(players, matchId) {
    io.in(players).socketsJoin(matchId);
    io.to(matchId).emit(MessageTypes.NEW_MATCH, {
        content: matchId,
    });
    findUsername(players[1]).then((username) =>
        createNotification(
            players[0],
            matchId,
            "New match started against " + username
        )
    );
    findUsername(players[0]).then((username) =>
        createNotification(
            players[1],
            matchId,
            "New match started against " + username
        )
    );
}

export function emitNewMove(playerNotified, originPlayer, matchId) {
    io.to(playerNotified).emit(MessageTypes.NEW_MOVE, {
        content: matchId,
        opponent: originPlayer,
    });
    createNotification(
        playerNotified,
        matchId,
        originPlayer + " has made a move made in a match"
    );
}

export async function emitMatchOver(matchId, players_id) {
    const players = [];
    for (let index in players_id) {
        const username = await findUsername(players_id[index]);
        players.push(username);
    }
    io.to(matchId).emit(MessageTypes.MATCH_OVER, JSON.stringify(players));
    createNotification(
        players_id[0],
        matchId,
        "Match against " + players[1] + " is over!"
    );
    createNotification(
        players_id[1],
        matchId,
        "Match against " + players[0] + " is over!"
    );
    io.socketsLeave(matchId);
}

async function findUsername(playerId) {
    const name = await UserModel.findById(playerId, ["username"]);
    return name?.username;
}

function createNotification(userId, matchId, message) {
    const notification = {
        userID: userId,
        matchId,
        message,
    };
    const notif = new NotificationModel(notification);
    notif.save();
}

export const closeSocket = (playedID) => {
    io.in(playedID).disconnectSockets();
};
