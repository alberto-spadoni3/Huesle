import { Grid, Box } from "@mui/material";
import useGameData from "../hooks/useGameData";
import Peg from "./Peg";

const AppSymbol = () => {

    const generateCircle = (pegColor) => {
        return (
            <label
                style={{
                    backgroundColor: pegColor,
                    justifyContent: "center",
                    height: "12px",
                    width:"12px",
                    borderColor: "white",
                    textAlign: "center",
                    borderRadius: "50%",
                    display: "inline-block",
                    border:"2px solid",
                }}
            ></label>
        );
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
        <Box height="40px" width="40px"  marginTop={0.9} marginRight={0.7}>
            <Grid container columns={2} height="100%">
                <GridItem>{generateCircle("coral")}</GridItem>
                <GridItem>{generateCircle("white")}</GridItem>
                <GridItem>{generateCircle("grey")}</GridItem>
                <GridItem>{generateCircle("coral")}</GridItem>
            </Grid>
        </Box>
    );
};

export default AppSymbol;
