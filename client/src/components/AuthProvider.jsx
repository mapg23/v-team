"use strict";
import { Navigate } from "react-router-dom";
import { createContext, use, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem("jwt")
  );

  const [userId, setUserId] = useState(
    () => sessionStorage.getItem("userId")
  );

  const login = (payload) => {
    const token = jwtDecode(payload.jwt);

    sessionStorage.setItem("jwt", payload.jwt);
    sessionStorage.setItem("userId", token.sub.userId);

    setUserId(token.sub.userId);
    setIsLoggedIn(true);
  };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        sessionStorage.removeItem("jwt");
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
