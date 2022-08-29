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
import GameBoard from "./components/GameBoard";
import GameContext from "./context/GameContext";
import GameRules from "./components/GameRules";
import Match from "./components/Match";
import { SocketProvider } from "./context/SocketProvider";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import NotificationsList from "./components/NotificationsList";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
    const [themeMode, setThemeMode] = useState("dark");

    const anchorOrigin = {
        vertical: "bottom",
        horizontal: "center",
    };

    return (
        <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={anchorOrigin}
                autoHideDuration={3000}
            >
                <SocketProvider>
                    <ScrollToTop>
                    <Routes>
                        <Route
                            path="/"
                            element={<Layout setThemeMode={setThemeMode} />}
                        >
                            {/* Public routes */}
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="forgotPassword" element={<ForgotPassword />} />
                            <Route path="resetPassword" element={<ResetPassword />} />

                            <Route path="rules" element={<GameRules />} />

                            {/* Routes that require authentication */}
                            <Route element={<PersistLogin />}>
                                <Route index element={<Home />} />
                                <Route element={<RequireAuth />}>
                                    <Route
                                        path="user/profile"
                                        element={<UserProfile />}
                                    />
                                </Route>

                                <Route element={<RequireAuth />}>
                                    <Route
                                        path="user/editProfile"
                                        element={<EditUserProfile />}
                                    />
                                </Route>

                                <Route element={<GameContext />}>
                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="settings"
                                            element={
                                                <Settings
                                                    themeMode={themeMode}
                                                    setThemeMode={setThemeMode}
                                                />
                                            }
                                        />
                                    </Route>

                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="dashboard"
                                            element={<Dashboard />}
                                        />
                                    </Route>

                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="notifications"
                                            element={<NotificationsList />}
                                        />
                                    </Route>

                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="searchMatch"
                                            element={<SearchMatch />}
                                        />
                                    </Route>

                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="match-details"
                                            element={<Match />}
                                        />
                                    </Route>

                                    <Route element={<RequireAuth />}>
                                        <Route
                                            path="gameboard"
                                            element={<GameBoard />}
                                        />
                                    </Route>
                                </Route>
                            </Route>

                            {/* No matching route */}
                            <Route path="*" element={<Missing />} />
                        </Route>
                    </Routes>
                    </ScrollToTop>
                </SocketProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
