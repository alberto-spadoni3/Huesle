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

const App = () => {
    const [themeMode, setThemeMode] = useState("dark");
    const [colorblindMode, setColorblindMode] = useState(false);

    return (
        <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
            <Routes>
                <Route
                    path="/"
                    element={<Layout setThemeMode={setThemeMode} />}
                >
                    {/* Public routes */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

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
                                element={<EditUserProfile />}
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
                                        setColorblindMode={setColorblindMode}
                                    />
                                }
                            />
                        </Route>

                        <Route element={<RequireAuth />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Route>
                </Route>

                {/* No matching route */}
                <Route path="*" element={<Missing />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
