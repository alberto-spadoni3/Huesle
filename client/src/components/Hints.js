import { Grid, Box } from "@mui/material";
import useGameData from "../hooks/useGameData";
import Peg from "./Peg";

const Hints = ({ isInRow }) => {
    const {HintTypes, PEGS_PER_ROW, matchHistory } =
        useGameData();

    let {rightPositions, rightColours} = 0
    if (matchHistory.length > isInRow) {
        rightPositions = matchHistory[isInRow].rightPositions;
        rightColours = matchHistory[isInRow].rightColours;
    }

    const generateHint = (id) => {
        let hintType = HintTypes.NoMatch;
        if (rightPositions > 0) {
            rightPositions--;
            hintType = HintTypes.ExactMatch;
        } else if (rightColours > 0) {
            rightColours--;
            hintType = HintTypes.ColorMatch;
        }
        return <Peg key={id} isInRow={isInRow} pegID={id} hintPeg hintType={hintType} />;
    };

    const GridItem = ({ children }) => {
        return (
            <Grid
                item
                xs={1}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </Grid>
        );
    };

    return (
        <Box height="52px" width="52px">
            <Grid container columns={2} height="100%">
                {Array(PEGS_PER_ROW)
                    .fill()
                    .map((_, index) => (
                        <GridItem key={index} >{generateHint(index)}</GridItem>
                    ))}
            </Grid>
        </Box>
    );
};

export default Hints;
