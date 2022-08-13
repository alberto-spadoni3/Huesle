import { useState, createContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";
import { BACKEND_GET_MATCH_ENDPOINT } from "../api/backend_endpoints";
import useSocket from "../hooks/useSocket";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [colorblindMode, setColorblindMode] = useState(false);

    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());

    const [id, setId] = useState({});

    const [attempts, setAttempts] = useState([]);

    const [status, setStatus] = useState({});

    const [players, setPlayers] = useState([]);

    const [profilePics, setProfilePics] = useState([]);

    const [endGame, setEndGame] = useState(false);

    const { auth } = useAuth();

    const { socket, MessageTypes } = useSocket();

    const NUMBER_OF_ATTEMPTS = 10;
    const PEGS_PER_ROW = 4;

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

    // each map entry contains the true color as key and the correzponding colorblind friendly color as value
    const guessableColors = new Map([
        ["crimson", "#648FFF"],
        ["coral", "#785EF0"],
        ["gold", "#4B0092"],
        ["forestgreen", "#DC267F"],
        ["mediumblue", "#FE6100"],
        ["rebeccapurple", "#FFB000"],
    ]);

    // color palette accessible to colorblind people
    /* const cbGuessableColors = [
        "#648FFF",
        "#785EF0",
        "#4B0092",
        "#DC267F",
        "#FE6100",
        "#FFB000",
    ]; */

    function isItActivePlayer() {
        return (
            status.state === GameStates.PLAYING &&
            status.player === auth.username
        );
    }

    function isMatchOver() {
        return status.state == GameStates.WINNER || status.state == GameStates.DRAW;
    }

    function updateMatch(newStatus, newAttempts) {
        setStatus(newStatus);
        const newArray = attempts.slice();
        newArray.push(newAttempts);
        setAttempts(newArray);
    }

    const keyOf = (map, valueToFind) => {
        for (let [key, value] of map) {
            if (valueToFind === value) {
                return key;
            }
        }
    };

    // This method is used to convert normal colors to the colorblind friendly ones and vice versa
    const swapColors = (sequence, trueToColorblind = false) => {
        const swappedColors = [];
        sequence.forEach((color) => {
            swappedColors.push(
                trueToColorblind
                    ? guessableColors.get(color)
                    : keyOf(guessableColors, color)
            );
        });
        return swappedColors;
    };

    function loadBoard(matchId = localStorage.getItem("matchId")) {
        if (matchId) {
            const response = axiosPrivate.get(BACKEND_GET_MATCH_ENDPOINT, {
                params: { matchId: matchId },
            });
            response.then((response) => {
                const { status, players, attempts } = response?.data?.match;
                setId(matchId);
                setPlayers(players);
                setStatus(status);
                setAttempts(attempts);
                setProfilePics(response?.data?.profile_pics);
            });
            localStorage.setItem("matchId", matchId);
            return Promise.resolve();
        }
    }

    useEffect(() => {
        socket.on(MessageTypes.NEW_MOVE, () => {
            loadBoard();
        });
        socket.on(MessageTypes.MATCH_OVER, () => {
            loadBoard();
        });
    }, [socket]);

    return (
        <GameDataContext.Provider
            value={{
                selectedColor,
                setSelectedColor,
                colorblindMode,
                setColorblindMode,
                currentPegsColor,
                setCurrentPegsColor,
                endGame,
                setEndGame,
                id,
                status,
                players,
                profilePics,
                attempts,
                isItActivePlayer,
                isMatchOver,
                updateMatch,
                loadBoard,
                swapColors,
                NUMBER_OF_ATTEMPTS,
                PEGS_PER_ROW,
                guessableColors,
                HintTypes,
                GameStates,
            }}
        >
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataContext;
