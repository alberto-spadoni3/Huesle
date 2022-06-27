import axios from "../api/axios";
import useAuth from "./useAuth";

const BACKEND_REFRESH_TOKEN_ENDPOINT = "/user/refreshToken";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(BACKEND_REFRESH_TOKEN_ENDPOINT, {
            withCredentials: true,
        });
        await setAuth({
            username: response.data?.username,
            accessToken: response.data.newAccessToken,
        });

        return response.data.newAccessToken;
    };

    return refresh;
};

export default useRefreshToken;
