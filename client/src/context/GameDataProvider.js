import {useState, createContext, useEffect} from "react";
import {axiosPrivate} from "../api/axios";
import {BACKEND_GET_MATCH_ENDPOINT} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");

    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());

    const [currentRow, setCurrentRow] = useState(0);

    const [matchHistory, setMatchHistory] = useState([]);

    const [status, setStatus] = useState([]);
    const [endGame, setEndGame] = useState(false);

    const {auth} = useAuth();

    const NUMBER_OF_ATTEMPTS = 10;
    const PEGS_PER_ROW = 4;

    function isItActivePlayer() {
        return (status.state == GameStates.PLAYING && status.player == auth.username);
    }

    const HintTypes = {
        NoMatch: "no-match",
        ExactMatch: "exact-match",
        ColorMatch: "color-match",
    };

    const GameStates = {
        DRAW: "DRAW",
        PLAYING: "PLAYING",
        WINNER: "WINNER"
    }

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
                currentRow,
                setCurrentRow,
                endGame,
                setEndGame,
                matchHistory,
                setMatchHistory,
                status,
                setStatus,
                isItActivePlayer,
                NUMBER_OF_ATTEMPTS,
                PEGS_PER_ROW,
                guessableColors,
                HintTypes
            }}
        >
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataContext;

