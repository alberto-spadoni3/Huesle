import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import useGameData from "../hooks/useGameData";

const ColorSelector = ({ theme }) => {
    const { selectedColor, setSelectedColor, guessableColors, colorblindMode } =
        useGameData();

    const pegColor = (index) => {
        const pegColor = colorblindMode
            ? Array.from(guessableColors.values())[index]
            : Array.from(guessableColors.keys())[index];
        return {
            backgroundColor: pegColor,
            color: pegColor,
        };
    };

    const handleChange = (event) => {
        setSelectedColor(event.target.value);
    };

    return (
        <Stack direction="row" justifyContent="center">
            {Array(guessableColors.size)
                .fill()
                .map((_, index) => (
                    <Radio
                        key={index}
                        checked={selectedColor === pegColor(index).color}
                        onChange={handleChange}
                        value={pegColor(index).color}
                        name="color-selector-radio"
                        sx={{
                            ...pegColor(index),
                            borderRadius: "8px",
                            marginX: "2px",
                            marginBottom: 1,
                            width: "15%",
                            "& .MuiSvgIcon-root": {
                                fontSize: 38,
                            },
                            "&:hover": {
                                ...pegColor(index),
                            },
                            "&.Mui-checked": {
                                ...pegColor(index),
                                borderRadius: "50%",
                            },
                        }}
                        inputProps={{
                            "aria-label": `Color ${pegColor(index).color}`,
                        }}
                    />
                ))}
        </Stack>
    );
};

export default ColorSelector;
