import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";
import { BACKEND_LOGOUT_ENDPOINT } from "../api/backend_endpoints";

const useLogout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const logout = async () => {
        try {
            await axios.get(BACKEND_LOGOUT_ENDPOINT, {
                withCredentials: true,
            });
            setAuth({});
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return logout;
};

export default useLogout;
