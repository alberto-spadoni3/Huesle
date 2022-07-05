import React, { useState } from "react";

const ColorBox = ({ color, tiny }) => {
    const [boxColor, setBoxColor] = useState(color ? color : "");

    const handleClick = () => {
        setBoxColor("");
    };

    return (
        <label
            style={{
                backgroundColor: boxColor,
                height: tiny ? "14px" : "52px",
                width: tiny ? "14px" : "52px",
                borderColor: "palette.text.primary",
                border: "2px solid",
                borderRadius: "50%",
                display: "inline-block",
            }}
            onClick={handleClick}
        ></label>
    );
};

export default ColorBox;
