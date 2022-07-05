import Missing from "./components/Missing";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import RequireAuth from "./components/RequireAuth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./components/theme";
import PersistLogin from "./components/PersistLogin";
import EditUserProfile from "./components/EditUserProfile";
import Dashboard from "./components/Dashboard";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import SearchMatch from "./components/SearchMatch";

const App = () => {
    const [themeMode, setThemeMode] = useState("dark");
    const [colorblindMode, setColorblindMode] = useState(false);

    const [snackbarAlertState, setSnackbarAlertState] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const anchorOrigin = {
        vertical: "bottom",
        horizontal: "center",
    };

    return (
        <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
            <CssBaseline />
            {/* <SnackbarAlert
                state={snackbarAlertState}
                setState={setSnackbarAlertState}
            /> */}
            <SnackbarProvider
                maxSnack={2}
                anchorOrigin={anchorOrigin}
                autoHideDuration={3000}
            >
                <Routes>
                    <Route
                        path="/"
                        element={<Layout setThemeMode={setThemeMode} />}
                    >
                        {/* Public routes */}
                        <Route index element={<Home />} />
                        <Route
                            path="login"
                            element={
                                <Login
                                    setSnackbarAlertState={
                                        setSnackbarAlertState
                                    }
                                />
                            }
                        />
                        <Route
                            path="register"
                            element={
                                <Register
                                    setSnackbarAlertState={
                                        setSnackbarAlertState
                                    }
                                />
                            }
                        />

                        {/* Routes that require authentication */}
                        <Route element={<PersistLogin />}>
                            <Route element={<RequireAuth />}>
                                <Route
                                    path="/user/profile"
                                    element={<UserProfile />}
                                />
                            </Route>

                            <Route element={<RequireAuth />}>
                                <Route
                                    path="/user/editProfile"
                                    element={
                                        <EditUserProfile
                                            setSnackbarAlertState={
                                                setSnackbarAlertState
                                            }
                                        />
                                    }
                                />
                            </Route>

                            <Route element={<RequireAuth />}>
                                <Route
                                    path="settings"
                                    element={
                                        <Settings
                                            themeMode={themeMode}
                                            setThemeMode={setThemeMode}
                                            colorblindMode={colorblindMode}
                                            setColorblindMode={
                                                setColorblindMode
                                            }
                                        />
                                    }
                                />
                            </Route>

                            <Route element={<RequireAuth />}>
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                            </Route>
                            <Route element={<RequireAuth />}>
                                <Route
                                    path="/searchMatch"
                                    element={<SearchMatch />}
                                />
                            </Route>
                        </Route>
                    </Route>

                    {/* No matching route */}
                    <Route path="*" element={<Missing />} />
                </Routes>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
