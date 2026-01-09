"use strict";
import { Navigate } from "react-router-dom";
import { createContext, use, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => sessionStorage.getItem("isLoggedIn") === "true"
    );

    const [userId, setUserId] = useState(
        () => sessionStorage.getItem("userId")
    );

    const checkLoggedin = () => {
        return sessionStorage.getItem("jwt") ? false : true;
    }

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", id);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("userId");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider, move it inside");
    }
    return ctx;
}

export const MiddleWare = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }
    return children;
}
