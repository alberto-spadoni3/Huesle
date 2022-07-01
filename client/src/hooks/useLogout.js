import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";

const BACKEND_LOGOUT_ENDPOINT = "/user/logout";

const useLogout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            await axios.get(BACKEND_LOGOUT_ENDPOINT, {
                withCredentials: true,
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return logout;
};

export default useLogout;
