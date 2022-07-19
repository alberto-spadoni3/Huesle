import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import useGameData from "../hooks/useGameData";

const ColorSelector = () => {
    const { selectedColor, setSelectedColor, guessableColors } = useGameData();

    const pegColor = (index) => {
        return {
            backgroundColor: guessableColors[index],
            color: guessableColors[index],
        };
    };

    const handleChange = (event) => {
        setSelectedColor(event.target.value);
    };

    return (
        <Stack direction="row">
            {Array(guessableColors.length)
                .fill()
                .map((_, index) => (
                    <Radio
                        key={index}
                        checked={selectedColor === guessableColors[index]}
                        onChange={handleChange}
                        value={guessableColors[index]}
                        name="color-selector-radio"
                        sx={{
                            ...pegColor(index),
                            borderRadius: "8px",
                            marginX: "2px",
                            marginBottom: 1,
                            width: "62px",
                            "& .MuiSvgIcon-root": {
                                fontSize: 40,
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
                            "aria-label": `Click to select color ${guessableColors[index]}`,
                        }}
                    />
                ))}
        </Stack>
    );
};

export default ColorSelector;
