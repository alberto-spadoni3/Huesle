import { Stack } from "@mui/material";
import Peg from "./Peg";
import Hints from "./Hints";
import useGameData from "../hooks/useGameData";
import useAuth from "../hooks/useAuth";

const DecodeRow = ({ rowID }) => {
    const { PEGS_PER_ROW, isItActivePlayer, attempts } = useGameData();
    const { auth } = useAuth();

    const getRowAspect = () => {
        let cssProps = {
            width: "fit-content",
            padding: 1,
            border: "3px solid",
            borderRadius: 2,
        };

        if (rowID === attempts.length && isItActivePlayer(auth.username))
            cssProps = {
                ...cssProps,
                borderStyle: "dashed",
                borderColor: "springgreen",
            };
        else if (rowID < attempts.length)
            cssProps = { ...cssProps, borderColor: "text.secondary" };
        else cssProps = { opacity: 0.5 };

        return cssProps;
    };

    return (
        <Stack
            id={rowID}
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
            <Hints key={rowID + "hints"} isInRow={rowID} />
        </Stack>
    );
};

export default DecodeRow;
