import { Grid, Box } from "@mui/material";
import Peg from "./Peg";

const Hints = ({ isInRow }) => {
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
                {Array(4)
                    .fill()
                    .map((_, index) => (
                        <GridItem key={index}>
                            <Peg tiny isInRow={isInRow} />
                        </GridItem>
                    ))}
            </Grid>
        </Box>
    );
};

export default Hints;
