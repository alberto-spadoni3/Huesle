import { useState, createContext } from "react";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");

    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());

    const [currentRow, setCurrentRow] = useState(0);

    const [exactMatches, setExactMatches] = useState(0);
    const [colorMatches, setColorMatches] = useState(0);

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
                exactMatches,
                setExactMatches,
                colorMatches,
                setColorMatches,
                endGame,
                setEndGame,
                success,
                setSuccess,
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
