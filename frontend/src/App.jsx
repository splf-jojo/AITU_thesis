import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthCtx } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Desktop from "./pages/Desktop";
import Mobile from "./pages/Mobile";
import About from "./pages/About";

function PrivateRoute({ children }) {
    const { token } = useContext(AuthCtx);
    return children;
    // return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            <Route
                path="/desktop"
                element={
                    <PrivateRoute>
                        <Desktop />
                    </PrivateRoute>
                }
            />

            <Route
                path="/mobile"
                element={
                    <PrivateRoute>
                        <Mobile />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
