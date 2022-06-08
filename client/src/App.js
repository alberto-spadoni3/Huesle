import Register from "./components/Register";
import Login from "./components/Login";
import Missing from "./components/Missing";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Settings from "./components/Settings";
import LoginMUI from "./components/LoginMUI";
import RegisterMUI from "./components/RegisterMUI";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<LoginMUI />} />
                <Route path="register" element={<RegisterMUI />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* No matching route */}
            <Route path="*" element={<Missing />} />
        </Routes>
    );
};

export default App;
