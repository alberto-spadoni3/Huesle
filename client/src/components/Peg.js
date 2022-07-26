import useGameData from "../hooks/useGameData";
import {useState, useEffect, useLayoutEffect} from "react";

const Peg = ({ pegID, isInRow, hintPeg, hintType}) => {
    const {
        selectedColor,
        setCurrentPegsColor,
        currentRow,
        matchHistory,
        HintTypes
    } = useGameData();

    const [pegColor, setPegColor] = useState("");

    const handleClick = () => {
        if (selectedColor && isInRow === currentRow && !hintPeg) {
            setPegColor(selectedColor);
            setCurrentPegsColor((map) => map.set(pegID, selectedColor));
        }
    };

    useLayoutEffect(() => {
        if(hintPeg) {
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
        } else if (matchHistory.length > isInRow) {
            setPegColor(matchHistory[isInRow].sequence[pegID]);
        }
    });

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
