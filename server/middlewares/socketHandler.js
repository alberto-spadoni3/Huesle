import {MatchModel} from "../model/MatchModel.js";
import {UserModel} from "../model/UserModel.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(3000, httpServer, { transports: ['websocket'], upgrade: false });

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        socket.userID = fetchUsernameId("paolo");
    } else {
        socket.userID = fetchUsernameId(username);
    }
    // create new session
    socket.sessionID = 0//randomId() ????????;
    socket.username = username;
    next();

});

//Single update to connected user with session details
io.on("connection", (socket) => {
    console.log(socket.userID + " connected");
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.join(socket.userID);

    //On event do
    socket.on("newmatch", ({ matchId }) => {
        const match = fetchMatchById(matchId);
        socket.to(match.players[0]).to(match.players[1]).emit("notification", {
            content: "New Match Found!"
        });
    });

    socket.on("newmove", ({ matchId, opponent }) => {
        console.log("new move received");
        const match = fetchMatchById(matchId);
        const opponentId = fetchUsernameId(opponent);
        socket.to(opponentId).emit("notification", {
            content: "New move made on match" + matchId
        });
    });

    socket.on("matchover", ({ matchId }) => {
        const match = fetchMatchById(matchId);
        socket.to(match.players[0]).to(match.players[1]).emit("notification", {
            content: "Match Over"
        });
    });
});

//Broadcast to all others
io.on("connection", (socket) => {
    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
    });
});

async function fetchMatchById(id) {
    const match = await MatchModel.findById(id, ['players', 'status']);
    return match;
}

//Doesn't work
async function fetchUsernameId(username) {
    const id = await UserModel.findOne({'username':username}, '_id');
    if(!id) return;
    else return id._id.toString();
}