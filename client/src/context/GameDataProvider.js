import { useState, createContext } from "react";

const GameDataContext = createContext({});

export const GameDataProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [currentPegsColor, setCurrentPegsColor] = useState(new Map());
    const [currentRow, setCurrentRow] = useState(0);

    const NUMBER_OF_ATTEMPTS = 10;
    const PEGS_PER_ROW = 4;

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
                NUMBER_OF_ATTEMPTS,
                PEGS_PER_ROW,
                guessableColors,
            }}
        >
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataContext;
