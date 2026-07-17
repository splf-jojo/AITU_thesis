// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthCtx = createContext(null);

function isExpired(t) {
    try {
        return jwtDecode(t).exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        const t = localStorage.getItem("token");
        return t && !isExpired(t) ? t : null;
    });
    const [email, setEmail] = useState(() => {
        try {
            return token ? jwtDecode(token).email : null;
        } catch {
            return null;
        }
    });

    /* обновляем email при смене token-a */
    useEffect(() => {
        try {
            setEmail(token ? jwtDecode(token).email : null);
        } catch {
            setEmail(null);
        }
    }, [token]);

    const login = (t) => {
        localStorage.setItem("token", t);
        setToken(t);
    };
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthCtx.Provider value={{ token, email, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}
