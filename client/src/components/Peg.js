import useGameData from "../hooks/useGameData";
import { useState, useLayoutEffect } from "react";
import {Box, darken, styled} from "@mui/material";

const Peg = ({ pegID, isInRow, hintPeg, hintType}) => {
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
    const [textColor, setTextColor] = useState("black");

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
                    setText("P");
                    break;
                case HintTypes.ColorMatch:
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

    function getPegColor(theme) {
        switch (hintType) {
            case HintTypes.ExactMatch:
                return theme.hintPosition;
            case HintTypes.ColorMatch:
                return theme.hintColor;
            default:
                return;
        }
    }

    const computeColorHex = (color) => {
        const a = document.createElement("div");
        a.style.color = color;
        const colors = window
            .getComputedStyle(document.body.appendChild(a))
            .color.match(/\d+/g)
            .map(function (a) {
                return parseInt(a, 10);
            });
        document.body.removeChild(a);
        return colors.length >= 3
            ? "#" +
                  ((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2])
                      .toString(16)
                      .substr(1)
            : false;
    };

    const MyBox = styled(Box)(({ theme }) => ({
        backgroundColor: hintPeg ? getPegColor(theme.palette.gameboard) : pegColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: hintPeg ? "18px" : "52px",
        width: hintPeg ? "18px" : "52px",
        color:  theme.palette.gameboard.hintLabel,
        border:
            (hintPeg ? "2px solid" : "3px solid") +
            " " +
            darken(computeColorHex(pegColor), 0.6),
        textAlign: "center",
        borderRadius: "50%",
        fontSize: "70%",
        fontWeight: "bold",
        cursor:
            isInRow === attempts.length &&
            selectedColor &&
            !hintPeg &&
            isItActivePlayer()
                ? "copy"
                : "default",
    }));

    return (
        <MyBox
            onClick={handleClick}
        >
            {text}
        </MyBox>
    );
};

export default Peg;
