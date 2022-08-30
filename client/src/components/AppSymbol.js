import { Grid, Box } from "@mui/material";

const AppSymbol = () => {
    const generateCircle = (pegColor) => {
        return (
            <Box
                style={{
                    backgroundColor: pegColor,
                    justifyContent: "center",
                    height: "12px",
                    width: "12px",
                    borderColor: "white",
                    textAlign: "center",
                    borderRadius: "50%",
                    display: "inline-block",
                    border: "2px solid",
                }}
            ></Box>
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
        <Box height="40px" width="40px">
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
