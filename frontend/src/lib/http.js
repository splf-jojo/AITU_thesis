// src/lib/http.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createBrowserHistory } from "history"; // npm i history

const history = createBrowserHistory();

function isExpired(t) {
    try {
        return jwtDecode(t).exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

const http = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 30000,
});

/* ---------------- request ---------------- */
http.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    if (token && !isExpired(token)) {
        cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

/* ---------------- response ---------------- */
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const { response, config } = err;
        if (response?.status === 401) {
            const isAuthRoute = ["/login", "/register"].some((p) =>
                config.url.endsWith(p)
            );
            const onAuthPage = ["/login", "/register"].includes(
                window.location.pathname
            );

            // если 401 пришёл НЕ со /login|/register и мы не на /login
            if (!isAuthRoute && !onAuthPage) {
                localStorage.removeItem("token");
                history.push("/login"); // мягкий редирект без перезагрузки
            }
        }
        return Promise.reject(err);
    }
);

export default http;
