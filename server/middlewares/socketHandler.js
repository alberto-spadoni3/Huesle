import { MatchModel } from "../model/MatchModel.js";
import { UserModel } from "../model/UserModel.js";
import { GameStates } from "../model/gameLogic.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(3001, {
    upgrade: false,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
        transports: ['websocket']
    }
});
io.attach(httpServer);

export class MessageTypes {
    static CONNECTION = "connection";
    static SESSION = "session";
    static NEW_MATCH = "new_match";
    static NEW_MOVE = "new_move";
    static END_MATCH = "end_match";
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
        userID: socket.userID
    });
});

io.on(MessageTypes.CONNECTION, (socket) => {
    socket.join(socket.userID);
    socket.emit(MessageTypes.SESSION, {
        userID: socket.userID
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
            "status.state" : GameStates.PLAYING
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
        content: matchId
    });
}

export function emitNewMove(playerNotified, originPlayer, matchId) {
    io.to(playerNotified).emit(MessageTypes.NEW_MOVE, {
        content: matchId,
        opponent: originPlayer
    });
}

export function emitMatchOver(matchId, status) {
    io.to(matchId).emit(MessageTypes.END_MATCH, {
        content: JSON.stringify({matchId, status})
    });
    io.socketsLeave(matchId);
}
