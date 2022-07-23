import {useState, createContext, useEffect} from "react";
import {axiosPrivate} from "../api/axios";
import {BACKEND_GET_MATCH_ENDPOINT} from "../api/backend_endpoints";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");

    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());

    const [currentRow, setCurrentRow] = useState(0);

    const [matchHistory, setMatchHistory] = useState([]);

    const [endGame, setEndGame] = useState(false);
    const [success, setSuccess] = useState(false);

    const NUMBER_OF_ATTEMPTS = 10;
    const PEGS_PER_ROW = 4;

    const HintTypes = {
        NoMatch: "no-match",
        ExactMatch: "exact-match",
        ColorMatch: "color-match",
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
                currentRow,
                setCurrentRow,
                endGame,
                setEndGame,
                success,
                setSuccess,
                matchHistory,
                setMatchHistory,
                NUMBER_OF_ATTEMPTS,
                PEGS_PER_ROW,
                guessableColors,
                HintTypes,
            }}
        >
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataContext;

