import { Grid, Box } from "@mui/material";
import useGameData from "../hooks/useGameData";
import Peg from "./Peg";

const Hints = ({ isInRow }) => {
    const { exactMatches, colorMatches, currentRow, HintTypes, PEGS_PER_ROW } =
        useGameData();

    const hints = [];
    let exact_matches = exactMatches;
    let color_matches = colorMatches;

    const generateHint = (id) => {
        let hintType = HintTypes.NoMatch;
        // Update current row
        if (isInRow === currentRow - 1) {
            if (exact_matches > 0) {
                exact_matches--;
                hintType = HintTypes.ExactMatch;
            } else if (color_matches > 0) {
                color_matches--;
                hintType = HintTypes.ColorMatch;
            }
        }
        return <Peg key={id} isInRow={isInRow} pegID={"hint" + id} hintPeg hintType={hintType} />;
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
