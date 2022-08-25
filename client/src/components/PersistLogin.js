import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";
import Loading from "./Loading";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist
            ? verifyRefreshToken()
            : setIsLoading(false);

        return () => (isMounted = false);
    }, []);

    return <>{!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}</>;
};

export default PersistLogin;
