// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (userData) => {
        setCurrentUser(userData);
        // console.log("User logged in:", userData);
        // In a real app, you might store a token in localStorage here.
    };

    const logout = () => {
        setCurrentUser(null);
        // console.log("User logged out.");
        // Clear token from localStorage if used.
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
