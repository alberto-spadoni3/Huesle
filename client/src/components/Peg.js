import useGameData from "../hooks/useGameData";
import { useState, useLayoutEffect } from "react";
import {darken, lighten} from "@mui/material";

const Peg = ({ pegID, isInRow, hintPeg, hintType }) => {
    const {
        selectedColor,
        setCurrentPegsColor,
        attempts,
        colorblindMode,
        swapColors,
        isItActivePlayer,
        HintTypes,
    } = useGameData();

    const [pegColor, setPegColor] = useState("");
    const [text, setText] = useState("");

    const handleClick = () => {
        if (
            selectedColor &&
            isInRow === attempts.length &&
            !hintPeg &&
            isItActivePlayer()
        ) {
            setPegColor(selectedColor);
            setCurrentPegsColor((map) => map.set(pegID, selectedColor));
        }
    };

    useLayoutEffect(() => {
        if (hintPeg) {
            switch (hintType) {
                case HintTypes.ExactMatch:
                    setPegColor("white");
                    setText("P");
                    break;
                case HintTypes.ColorMatch:
                    setPegColor("grey");
                    setText("C");
                    break;
                default:
                    setPegColor("");
                    break;
            }
        } else if (attempts.length > isInRow) {
            const pegsColor = attempts[isInRow].sequence;
            setPegColor(
                colorblindMode
                    ? swapColors(pegsColor, true)[pegID]
                    : pegsColor[pegID]
            );
        }
    });

    const computeColorHex = (color) => {
        color = color != ""? color: "black";
        const a = document.createElement('div');
        a.style.color = color;
        const colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
        document.body.removeChild(a);
        return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
    }

    return (
        <label
            style={{
                backgroundColor: pegColor,
                justifyContent: "center",
                height: hintPeg ? "16px" : "52px",
                width: hintPeg ? "16px" : "52px",
                color: "black",
                border: (hintPeg ? "2px solid" : "3px solid") +  " " + darken(computeColorHex(pegColor), 0.6),
                textAlign: "center",
                borderRadius: "50%",
                fontSize: "52%",
                fontWeight: "bold",
                display: "inline-block",
                cursor:
                    isInRow === attempts.length && selectedColor && !hintPeg
                        ? "copy"
                        : "default",
            }}
            onClick={handleClick}
        >{text}</label>
    );
};

export default Peg;
