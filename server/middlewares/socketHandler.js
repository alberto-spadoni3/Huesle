import {MatchModel} from "../model/MatchModel.js";
import {UserModel} from "../model/UserModel.js";
import {GameStates} from "../model/gameLogic.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();
const httpServer = createServer(app);
const io = new Server(3000, httpServer, { transports: ['websocket'], upgrade: false });

export class MessageTypes {
    static CONNECTION = "connection"
    static SESSION = "session"
    static NOTIFICATION = "notification"
}

io.use((socket, next) => {
    const sessionID = null//socket.handshake.auth.sessionID;
    if (sessionID) {
        // find existing session
        const session = null//sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }

    var username;
    if (!socket.handshake.auth.username) {
        //console.log("Error");
        username = "paolo"
    } else {
        username = socket.handshake.auth.username;
    }

    // create new session
     fetchUsernameId(username).then((id) => {
        socket.userID = id;
        socket.sessionID = 0//randomId() ????????;
        socket.username = username;
        next();
    });
});

io.on(MessageTypes.CONNECTION, (socket) => {
    socket.emit(MessageTypes.SESSION, {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.join(socket.userID);

    connectUserToMatchSockets(socket.userID);
});

async function fetchUsernameId(username) {
    const id = await UserModel.findOne({'username':username}, '_id');
    if(!id) return;
    else return id._id.toString();
}

async function connectUserToMatchSockets(id) {
    const matches = await MatchModel.find({
            "players": id,
            $or: [{status: GameStates.TURN_P1}, {status: GameStates.TURN_P2}]
        }, "_id");
    matches.forEach(match => {
        io.in(id).socketsJoin(match._id.toString());
    })
}

export function emitNewMatch(players, matchId) {
    io.in(players).socketsJoin(matchId);
    io.to(matchId).emit(MessageTypes.NOTIFICATION, {
        content: "New Match Found!"
    });
}

export function emitNewMove(playerNotified, matchId) {
    io.to(playerNotified).emit(MessageTypes.NOTIFICATION, {
        content: "New move made on match" + matchId
    });
}

export function emitMatchOver(matchId, status) {
    io.to(matchId).emit(MessageTypes.NOTIFICATION, {
        content: "Match is over, " + status
    });
    io.socketsLeave(matchId);
}