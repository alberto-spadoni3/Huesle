import { Stack } from "@mui/material";
import Peg from "./Peg";
import Hints from "./Hints";
import useGameData from "../hooks/useGameData";

const DecodeRow = ({ rowID }) => {
    const { currentRow, PEGS_PER_ROW } = useGameData();

    const getRowAspect = () => {
        let cssProps = {
            width: "fit-content",
            padding: 1,
            border: "3px solid",
            borderRadius: 2,
        };

        if (rowID === currentRow)
            cssProps = {
                ...cssProps,
                borderStyle: "dashed",
                borderColor: "springgreen",
            };
        else if (rowID < currentRow)
            cssProps = { ...cssProps, borderColor: "rgb(239,226,219)" };
        else cssProps = { opacity: 0.5 };

        return cssProps;
    };

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            height="72px"
            sx={getRowAspect}
        >
            {Array(PEGS_PER_ROW)
                .fill()
                .map((_, index) => (
                    <Peg key={index} pegID={index} isInRow={rowID} />
                ))}
            <Hints key={rowID + 1} isInRow={rowID} />
        </Stack>
    );
};

export default DecodeRow;
