import {Box, Typography, styled, Fade} from "@mui/material";
import React from "react";
import BackButton from "./BackButton";

const GameRules = () => {
    const rules = [
        "This is a revised version of the classic Mastermind game in which two players play together in order to guess a six-color code generated by the computer. Each player uses it's own device and the game is synchronous. That means that the player A, after he has made the guess, must wait that player B has also completed its turn in order to submit the next guess.",
        "In the random generated code, one color can be repeated from one to 6 times. Players have a total of 10 attempts to correctly guess the code. A match is lost if, after the submission of the tenth guess, the code is still not be predicted or if the adversary guess the code correctly first.",
        "A user that wants to play can proceed in three different ways:",
        "1) Search and eventually join a public match with another random player.",
        "2) Create a private match protected by a secret key.",
        "3) Join a private match using the corresponding secret key.",
    ];

    const RulesBox = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        border: "2px solid white",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginTop: "16px",
        padding: "8px",
    }));

    return (
        <>
            <BackButton />
            <Fade in={true}>
            <Box
                sx={{
                    width: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">How to play</Typography>
                <RulesBox>
                    {rules.map((rule, index) => (
                        <Typography key={index} variant="body1">
                            {rule}
                        </Typography>
                    ))}
                </RulesBox>
            </Box>
            </Fade>
        </>
    );
};

export default GameRules;
