import Missing from "./components/Missing";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Settings from "./components/Settings";
import LoginMUI from "./components/LoginMUI";
import RegisterMUI from "./components/RegisterMUI";
import UserProfile from "./components/UserProfile";
import RequireAuth from "./components/RequireAuth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./components/theme";
// import PersistLogin from "./components/PersistLogin";

const App = () => {
    const [themeMode, setThemeMode] = useState("dark");

    return (
        <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public routes */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<LoginMUI />} />
                    <Route path="register" element={<RegisterMUI />} />
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

                {/* Routes that require authentication */}
                {/* <Route element={<PersistLogin />}> */}
                <Route element={<RequireAuth />}>
                    <Route path="user" element={<UserProfile />} />
                </Route>
                {/* </Route> */}

                {/* No matching route */}
                <Route path="*" element={<Missing />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
