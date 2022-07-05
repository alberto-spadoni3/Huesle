import { Grid, Box, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import ColorBox from "./ColorBox";

const NUMBER_OF_ATTEMPTS = 10;

const GameBoard = () => {
    const [selectedColor, setSelectedColor] = useState("");
    const gameColors = [
        "crimson",
        "coral",
        "gold",
        "forestgreen",
        "mediumblue",
        "rebeccapurple",
    ];

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

    const HintContainer = () => {
        return (
            <Box height="52px" width="52px">
                <Grid container columns={2} height="100%">
                    {Array.from(Array(4)).map((_, index) => (
                        <GridItem key={index}>
                            <ColorBox tiny />
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        );
    };

    useEffect(() => {
        if (selectedColor) console.log(selectedColor);
    }, [selectedColor]);

    return (
        <>
            <BackButton />
            <Box
                sx={{
                    border: "3px solid",
                    borderColor: "palette.text.primary",
                    borderRadius: "10px",
                    backgroundColor: "peru",
                    marginTop: 1,
                    padding: "8px 0",
                }}
            >
                <Grid
                    container
                    columns={5}
                    rowSpacing={2}
                    columnSpacing={2}
                    justifyContent="center"
                >
                    {Array.from(Array(NUMBER_OF_ATTEMPTS * 5)).map((_, index) =>
                        index + 1 !== 0 && (index + 1) % 5 === 0 ? (
                            <GridItem key={index}>
                                <HintContainer />
                            </GridItem>
                        ) : (
                            <GridItem key={index}>
                                <ColorBox />
                            </GridItem>
                        )
                    )}
                </Grid>
            </Box>
            <Box
                sx={{
                    border: "2px solid",
                    borderColor: "palette.text.primary",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    padding: "4px 2px",
                    marginTop: 1,
                }}
            >
                <Stack direction="row">
                    {Array.from(Array(6)).map((_, index) => (
                        <Button
                            key={index}
                            sx={{
                                backgroundColor: gameColors[index],
                                marginX: "2px",
                                minWidth: "unset",
                                height: "50px",
                                width: "62px",
                                "&:hover": {
                                    backgroundColor: gameColors[index],
                                    opacity: 0.7,
                                    width: "80px",
                                },
                            }}
                            onClick={(e) => setSelectedColor(gameColors[index])}
                        ></Button>
                    ))}
                </Stack>
            </Box>
            <Button
                sx={{
                    width: "100%",
                    border: "1px solid white",
                    borderRadius: "5px",
                    marginY: 2,
                }}
                variant="contained"
                color="neutral"
            >
                Send Attempt
            </Button>
        </>
    );
};

export default GameBoard;
