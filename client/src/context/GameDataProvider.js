import { useState, createContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {axiosPrivate} from "../api/axios";
import {BACKEND_GET_MATCH_ENDPOINT} from "../api/backend_endpoints";
import useSocket from "../hooks/useSocket";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");

    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());

    const [id, setId] = useState({});

    const [attempts, setAttempts] = useState([]);

    const [status, setStatus] = useState({});

    const [players, setPlayers] = useState([]);

    const [endGame, setEndGame] = useState(false);

    const { auth } = useAuth();

    const {socket, MessageTypes} = useSocket();

    const NUMBER_OF_ATTEMPTS = 10;
    const PEGS_PER_ROW = 4;

    function isItActivePlayer() {
        return (
            status.state === GameStates.PLAYING &&
            status.player === auth.username
        );
    }

    function updateMatch(newStatus, newAttempts) {
        setStatus(newStatus);
        const newArray = attempts.slice();
        newArray.push(newAttempts);
        setAttempts(newArray);
    }

    function loadBoard(matchId = localStorage.getItem("matchId")) {
        if(matchId) {
            const response = axiosPrivate.get(BACKEND_GET_MATCH_ENDPOINT, {
                params: {matchId: matchId},
            });
            response.then(response => {
                const {status, players, attempts} = response?.data?.match;
                setId(matchId);
                setPlayers(players);
                setStatus(status);
                setAttempts(attempts);
            })
            localStorage.setItem("matchId", matchId)
        }
    }

    useEffect(() => {
        socket.on(MessageTypes.NEW_MOVE, () => {
            loadBoard();
        });
    }, [socket]);


    const HintTypes = {
        NoMatch: "no-match",
        ExactMatch: "exact-match",
        ColorMatch: "color-match",
    };

    const GameStates = {
        DRAW: "DRAW",
        PLAYING: "PLAYING",
        WINNER: "WINNER",
    };

    const guessableColors = [
        "crimson",
        "coral",
        "gold",
        "forestgreen",
        "mediumblue",
        "rebeccapurple",
    ];

    return (
        <GameDataContext.Provider
            value={{
                selectedColor,
                setSelectedColor,
                currentPegsColor,
                setCurrentPegsColor,
                endGame,
                setEndGame,
                id,
                status,
                players,
                attempts,
                isItActivePlayer,
                updateMatch,
                loadBoard,
                NUMBER_OF_ATTEMPTS,
                PEGS_PER_ROW,
                guessableColors,
                HintTypes,
                GameStates
            }}
        >
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataContext;
