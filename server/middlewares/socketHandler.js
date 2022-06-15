import {MatchModel} from "../model/MatchModel.js";
import {UserModel} from "../model/UserModel.js";

import {Server} from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        // find existing session
        /*const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }*/
    }

    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = 0//randomId() ????????;
    socket.userID = fetchUsernameId();
    socket.username = username;
    next();
});

//Single update to connected user with session details
io.on("connection", (socket) => {
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

async function fetchUsernameId(username) {
    const id = await UserModel.findOne({username: username}, ['_id']);
    return id;
}
