import Register from "./components/Register";
import Login from "./components/Login";
import Missing from "./components/Missing";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* No matching route */}
            <Route path="*" element={<Missing />} />
        </Routes>
    );
};

export default App;
