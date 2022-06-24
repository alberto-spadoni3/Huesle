import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    /* useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axios.get(`/user/${auth?.username}`);
                console.log(response.data);
                isMounted && setUserInfo(response.data);
            } catch (err) {
                console.error(err);
                navigate("/login", {
                    state: { from: location },
                    replace: true,
                });
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []); */

    return (
        <div>
            <h1>User Profile</h1>
            <h3>Username: {auth.username}</h3>
            <button onClick={handleLogout}>LOGOUT</button>
            <Link to="/">Home</Link>
        </div>
    );
};

export default UserProfile;
