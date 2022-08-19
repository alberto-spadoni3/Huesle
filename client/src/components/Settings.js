import { Box, Typography, Avatar, Stack, Switch, Fade } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect } from "react";
import BackButton from "./BackButton";
import { BACKEND_SETTINGS_ENDPOINT } from "../api/backend_endpoints";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useGameData from "../hooks/useGameData";

const Settings = ({ themeMode, setThemeMode }) => {
    const axiosPrivate = useAxiosPrivate();
    const { colorblindMode, setColorblindMode } = useGameData();
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
                const response = await axiosPrivate.get(
                    BACKEND_SETTINGS_ENDPOINT
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
            const response = await axiosPrivate.put(
                BACKEND_SETTINGS_ENDPOINT,
                JSON.stringify({ darkMode, colorblindMode })
            );

            if (response.status === 200) {
                console.log(`Settings updated succesfully`);
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
                            bgcolor: "gray",
                            width: 80,
                            height: 80,
                        }}
                    >
                        <SettingsIcon
                            fontSize="large"
                            style={{ color: "white" }}
                        />
                    </Avatar>
                    <Typography
                        color="text.primary"
                        component="h1"
                        variant="h4"
                    >
                        Settings
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            mt: 4,
                            bgcolor: "background.dashboardMenu",
                            border: "2px solid",
                            borderColor: "palette.text.secondary",
                            borderRadius: 8,
                            padding: 2,
                        }}
                    >
                        <Stack spacing={2} width="inherit">
                            <SettingContainer>
                                <Typography
                                    variant="h6"
                                    textAlign="center"
                                    color="text.primary"
                                >
                                    Dark mode
                                </Typography>
                                <Switch
                                    color="switch"
                                    checked={themeMode === "dark"}
                                    onChange={(e) => {
                                        const darkMode =
                                            themeMode === "dark"
                                                ? "light"
                                                : "dark";
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
                                <Typography
                                    variant="h6"
                                    textAlign="center"
                                    color="text.primary"
                                >
                                    Colorblind mode
                                </Typography>
                                <Switch
                                    color="switch"
                                    checked={colorblindMode}
                                    onClick={(e) => {
                                        const cbMode = !colorblindMode;
                                        setColorblindMode(cbMode);
                                        saveSettings(
                                            themeMode === "dark",
                                            cbMode
                                        );
                                    }}
                                    inputProps={cbSwitch}
                                />
                            </SettingContainer>
                        </Stack>
                    </Box>
                </Box>
            </Fade>
        </>
    );
};

export default Settings;
