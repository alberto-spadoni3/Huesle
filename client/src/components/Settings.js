import {
    Box,
    Container,
    Typography,
    Avatar,
    Stack,
    FormControlLabel,
    Switch,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React from "react";
import { styled } from "@mui/system";
import BackButton from "./BackButton";

const Settings = ({ themeMode, setThemeMode }) => {
    const SettingContainer = ({ children }) => {
        return (
            <Stack direction="row" justifyContent="space-between" paddingX={2}>
                {children}
            </Stack>
        );
    };

    const dmSwitch = { "aria-label": "Switch for dark mode" };
    const cbSwitch = { "aria-label": "Switch for colorblind mode" };

    return (
        <>
            <BackButton />
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
                        bgcolor: "primary.main",
                        width: 64,
                        height: 64,
                    }}
                >
                    <SettingsIcon fontSize="large" />
                </Avatar>
                <Typography component="h1" variant="h4">
                    Settings
                </Typography>
                <Stack spacing={2} width="inherit" marginTop={4}>
                    <SettingContainer>
                        <Typography variant="h6" textAlign={"center"}>
                            Dark mode
                        </Typography>
                        <Switch
                            checked={themeMode === "dark"}
                            onChange={(e) =>
                                setThemeMode(
                                    themeMode === "dark" ? "light" : "dark"
                                )
                            }
                            inputProps={dmSwitch}
                        />
                    </SettingContainer>
                    <SettingContainer>
                        <Typography variant="h6" textAlign={"center"}>
                            Colorblind mode
                        </Typography>
                        <Switch inputProps={cbSwitch} />
                    </SettingContainer>
                </Stack>
            </Box>
        </>
    );
};

export default Settings;
