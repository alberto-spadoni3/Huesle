import useGameData from "../hooks/useGameData";
import { useState, useEffect } from "react";

const Peg = ({ pegID, isInRow, hintPeg, hintType }) => {
    const {
        selectedColor,
        setCurrentPegsColor,
        currentRow,
        HintTypes,
        exactMatches,
        colorMatches,
    } = useGameData();

    const [pegColor, setPegColor] = useState("");

    const handleClick = () => {
        if (selectedColor && isInRow === currentRow && !hintPeg) {
            setPegColor(selectedColor);
            setCurrentPegsColor((map) => map.set(pegID, selectedColor));
        }
    };

    useEffect(() => {
        if (hintPeg && isInRow === currentRow - 1) {
            switch (hintType) {
                case HintTypes.ExactMatch:
                    setPegColor("white");
                    break;
                case HintTypes.ColorMatch:
                    setPegColor("grey");
                    break;
                default:
                    setPegColor("");
                    break;
            }
        }
    }, [exactMatches, colorMatches]);

    return (
        <label
            style={{
                backgroundColor: pegColor,
                height: hintPeg ? "16px" : "52px",
                width: hintPeg ? "16px" : "52px",
                borderColor: "white",
                border: hintPeg ? "2px solid" : "3px solid",
                borderRadius: "50%",
                display: "inline-block",
                cursor:
                    isInRow === currentRow && selectedColor && !hintPeg
                        ? "copy"
                        : "default",
            }}
            onClick={handleClick}
        />
    );
};

export default Peg;
