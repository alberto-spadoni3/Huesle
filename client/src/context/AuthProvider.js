import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(
        JSON.parse(localStorage.getItem("persist")) || false
    );

    const MessageTypes = {
        CONNECTION: "connection",
        SESSION: "session",
        NOTIFICATION: "notification",
        SEARCHING: "searching",
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, MessageTypes }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
