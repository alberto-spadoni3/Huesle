import {MatchModel} from "../model/MatchModel.js";
import {UserModel} from "../model/UserModel.js";
import {GameStates} from "../model/gameLogic.js";
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

    var username;
    if (!socket.handshake.auth.username) {
        console.log("Error");
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

//Single update to connected user with session details
io.on("connection", (socket) => {
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.join(socket.userID);

    connectUserToMatchSockets(socket.userID);

    //On event do
    socket.on("newmatch", ({ matchId }) => {
        const match = fetchMatchById(matchId).then((match) => {
            if(match) {
                io.in(match.players).socketsJoin(matchId);
                io.to(matchId).emit("notification", {
                    content: "New Match Found!"
                });
            } else console.log("Error");
        });
    });

    socket.on("newmove", ({ matchId }) => {
        io.in(matchId).fetchSockets().then(sockets => {
            console.log(sockets.length)
            for (const player of sockets) {
                if (player.userID !== socket.userID) {
                    //Maybe io. is needed
                    socket.to(player.userID).emit("notification", {
                        content: "New move made on match" + matchId
                    });
                }
            }
        });
    });

    socket.on("matchover", ({ matchId }) => {
        io.to(matchId).emit("notification", {
            content: "Match is over"
        });
        io.socketsLeave(matchId);
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