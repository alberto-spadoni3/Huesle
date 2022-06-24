import axios from "../api/axios";
import useAuth from "./useAuth";

const BACKEND_LOGOUT_ENDPOINT = "/user/logout";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axios.get("/user/logout", {
                withCredentials: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return logout;
};

export default useLogout;
