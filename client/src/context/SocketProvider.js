import { useState, createContext, useEffect } from "react";
import socketIOClient from "socket.io-client";
import useAuth from "../hooks/useAuth";
import {BACKEND_SOCKET_ENDPOINT} from "../api/backend_endpoints";
import {useSnackbar} from "notistack";

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
    const {auth} = useAuth();

    const [socket, setSocket] = useState(socketIOClient());

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setSocket(socketIOClient(BACKEND_SOCKET_ENDPOINT, {
            withCredentials: true,
            transports: ["websocket"],
            auth: {
                username: auth.username
            }
        }));

        return () => {
            socket.disconnect();
        }
    }, [auth.username]);

    useEffect(() => {
        socket.on(MessageTypes.NEW_MATCH, () => {
            enqueueSnackbar("New match found!", {
                variant: "info",
                autoHideDuration: 2500,
            });
        });

        socket.on(MessageTypes.NEW_MOVE, (data) => {
            enqueueSnackbar("New move made on match against " + data.opponent, {
                variant: "info",
                autoHideDuration: 2500,
            });
        });

        socket.on(MessageTypes.MATCH_OVER, (data) => {
            const players = JSON.parse(data)
            enqueueSnackbar("The match against " + players.find(p => p != auth.username) + " is over!", {
                variant: "info",
                autoHideDuration: 2500,
            });
        });

    }, [socket])

    const MessageTypes = {
        CONNECTION: "connection",
        SESSION: "session",
        NEW_MATCH: "new_match",
        NEW_MOVE: "new_move",
        MATCH_OVER: "match_over"
    }

    return (
        <SocketContext.Provider
            value={{
                socket,
                MessageTypes
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
