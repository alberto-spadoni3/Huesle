import socketIOClient from "socket.io-client";
import {BACKEND_SOCKET_ENDPOINT} from "./backend_endpoints";


const socket = socketIOClient(BACKEND_SOCKET_ENDPOINT, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;

export const MessageTypes = {
    CONNECTION: "connection",
    SESSION: "session",
    NOTIFICATION: "notification",
    SEARCHING: "searching",
}




