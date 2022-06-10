import Missing from "./components/Missing";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Settings from "./components/Settings";
import LoginMUI from "./components/LoginMUI";
import RegisterMUI from "./components/RegisterMUI";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./components/theme";

const App = () => {
    const [themeMode, setThemeMode] = useState("dark");

    return (
        <ThemeProvider theme={createTheme(getDesignTokens(themeMode))}>
            <Routes>
                <Route path="/" element={<Layout />}>
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

                {/* No matching route */}
                <Route path="*" element={<Missing />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
