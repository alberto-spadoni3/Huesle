import { useState } from "react";
import useGameData from "../hooks/useGameData";

const Peg = ({ pegID, isInRow, tiny }) => {
    const [pegColor, setPegColor] = useState("");
    const { selectedColor, setCurrentPegsColor, currentRow } = useGameData();

    const handleClick = () => {
        if (selectedColor && isInRow === currentRow && pegID >= 0) {
            setPegColor(selectedColor);
            setCurrentPegsColor((map) => map.set(pegID, selectedColor));
        }
    };

    return (
        <label
            style={{
                backgroundColor: pegColor,
                height: tiny ? "14px" : "52px",
                width: tiny ? "14px" : "52px",
                borderColor: "white",
                border: "3px solid",
                borderRadius: "50%",
                display: "inline-block",
                cursor:
                    isInRow === currentRow && selectedColor && !tiny
                        ? "copy"
                        : "default",
            }}
            onClick={handleClick}
        />
    );
};

export default Peg;
