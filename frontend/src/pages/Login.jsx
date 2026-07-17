import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthCtx } from "../context/AuthContext";
import http from "../lib/http";
import toErrorMsg from "../helpers/errorMsg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [err, setErr] = useState("");

    const nav = useNavigate();
    const { login } = useContext(AuthCtx);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await http.post("/login", {
                email,
                password: pwd,
            });
            login(data.access_token);
            nav("/");
        } catch (e) {
            const raw = e.response?.data?.detail || e.message;
            setErr(toErrorMsg(raw));
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br
                    from-slate-900 via-slate-800 to-slate-900 px-4"
        >
            <form
                onSubmit={submit}
                className="w-full max-w-md rounded-2xl bg-slate-800/60 backdrop-blur
                   shadow-2xl p-8"
            >
                <h1 className="text-center text-3xl font-semibold mb-6 text-slate-100">
                    Войти
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    required
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="input-field mb-6"
                />

                {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

                <button
                    className="w-full py-3 rounded-xl font-medium
                           bg-cyan-500 hover:bg-cyan-400 transition-colors"
                >
                    Продолжить
                </button>

                <p className="text-center text-sm text-slate-400 mt-4">
                    Нет аккаунта?{" "}
                    <Link
                        to="/register"
                        className="text-cyan-400 hover:underline"
                    >
                        Зарегистрируйтесь
                    </Link>
                </p>
            </form>
        </div>
    );
}
