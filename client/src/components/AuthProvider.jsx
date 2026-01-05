"use strict";
import { Navigate } from "react-router-dom";
import { createContext, use, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem("isLoggedIn") === "true"
    );

    const [userId, setUserId] = useState(
        () => localStorage.getItem("userId")
    );

    const checkLoggedin = () => {
        let jwt = localStorage.getItem("jwt") ? false : true;
        let userId = localStorage.getItem("userId") ? false : true;

        if (!jwt || !userId) {
            return false;
        }

        return true;
    }

    const login = (id) => {
        setIsLoggedIn(true);
        setUserId(id);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", id);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
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
