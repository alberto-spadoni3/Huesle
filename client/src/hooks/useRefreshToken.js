import axios from "../api/axios";
import useAuth from "./useAuth";
import { BACKEND_REFRESH_TOKEN_ENDPOINT } from "../api/backend_endpoints";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(BACKEND_REFRESH_TOKEN_ENDPOINT, {
            withCredentials: true,
        });
        await setAuth({
            username: response.data?.username,
            accessToken: response.data?.newAccessToken,
            profilePicID: response.data?.profilePicID,
            email: response.data?.email,
        });
        return response.data.newAccessToken;
    };

    return refresh;
};

export default useRefreshToken;
