import { Box, Typography, styled, Fade, Avatar } from "@mui/material";
import React from "react";
import BackButton from "./BackButton";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

const GameRules = () => {
    const rules = [
        "This is a revised version of the classic Mastermind game in which two players play together in order to guess a six-color code randomly generated where colors can be repetead.",
        "The players will alternate making submission in a synchronous way: for each guess a feedback will be given, where each Ⓒ peg indicates a correct color in the wrong position and a Ⓟ peg indicates a correct color in the correct position.",
        "Players have a total of 10 attempts to correctly guess the code. A match is lost if, after the submission of the tenth guess, the code is still not be predicted or if the adversary guess the code correctly first.",
        "A user that wants to play can proceed in three different ways:",
        "- Search for a public match with another random player.",
        "- Create a private match associated to a secret key.",
        "- Join a private match using the corresponding secret key.",
    ];

    const RulesBox = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        border: "2px solid",
        borderColor: theme.palette.text.secondary,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginTop: "32px",
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
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "#555580",
                            width: 80,
                            height: 80,
                        }}
                    >
                        <QuestionMarkIcon
                            fontSize="large"
                            style={{ color: "white" }}
                        />
                    </Avatar>
                    <Typography color="text.primary" variant="h4">
                        How to play
                    </Typography>
                    <RulesBox>
                        {rules.map((rule, index) => (
                            <Typography
                                textAlign="justify"
                                key={index}
                                variant="body1"
                            >
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
