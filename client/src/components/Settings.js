import { Box, Typography, Avatar, Stack, Switch } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect } from "react";
import axios from "../api/axios";
import BackButton from "./BackButton";
import useAuth from "../hooks/useAuth";
import { BACKEND_SETTINGS_ENDPOINT } from "../api/backend_endpoints";

const Settings = ({
    themeMode,
    setThemeMode,
    colorblindMode,
    setColorblindMode,
}) => {
    const { auth } = useAuth();
    const dmSwitch = { "aria-label": "Switch for dark mode" };
    const cbSwitch = { "aria-label": "Switch for colorblind mode" };

    const SettingContainer = ({ children }) => {
        return (
            <Stack direction="row" justifyContent="space-between" paddingX={2}>
                {children}
            </Stack>
        );
    };

    useEffect(() => {
        const loadUserSettings = async () => {
            try {
                const response = await axios.get(
                    BACKEND_SETTINGS_ENDPOINT + `/${auth.username}`
                );
                if (response.status === 200) {
                    const themeMode = response?.data?.darkMode
                        ? "dark"
                        : "light";
                    setThemeMode(themeMode);
                    setColorblindMode(response?.data?.colorblindMode);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadUserSettings();
    }, []);

    const saveSettings = async (darkMode, colorblindMode) => {
        try {
            const username = auth.username;
            const response = await axios.put(
                BACKEND_SETTINGS_ENDPOINT,
                JSON.stringify({ username, darkMode, colorblindMode }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                console.log(`Settings for ${username} updated succesfully`);
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No Server Response");
            } else if (error.response?.status === 401) {
                console.log("Unauthorized");
            } else {
                console.log("Save settings failed");
            }
        }
    };

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
                            onChange={(e) => {
                                const darkMode =
                                    themeMode === "dark" ? "light" : "dark";
                                setThemeMode(darkMode);
                                saveSettings(
                                    darkMode === "dark",
                                    colorblindMode
                                );
                            }}
                            inputProps={dmSwitch}
                        />
                    </SettingContainer>
                    <SettingContainer>
                        <Typography variant="h6" textAlign={"center"}>
                            Colorblind mode
                        </Typography>
                        <Switch
                            checked={colorblindMode}
                            onClick={(e) => {
                                const cbMode = !colorblindMode;
                                setColorblindMode(cbMode);
                                saveSettings(themeMode === "dark", cbMode);
                            }}
                            inputProps={cbSwitch}
                        />
                    </SettingContainer>
                </Stack>
            </Box>
        </>
    );
};

export default Settings;
