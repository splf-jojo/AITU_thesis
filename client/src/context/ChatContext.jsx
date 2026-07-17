// src/context/ChatContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import http from "../lib/http";
import { AuthCtx } from "./AuthContext";

export const ChatCtx = createContext(null);

export default function ChatProvider({ children }) {
    const { token } = useContext(AuthCtx);

    /* ————— state ————— */
    const [sessions, setSessions] = useState([]); // список чатов
    const [current, setCurrent] = useState(null); // id (tmp|real)
    const [messages, setMessages] = useState([]); // сообщения

    /* ───────── загрузка списков чатов ───────── */
    useEffect(() => {
        if (!token) {
            setSessions([]);
            return;
        }
        http.get("/sessions").then(({ data }) => setSessions(data));
    }, [token]);

    /* ───────── загрузка истории ───────── */
    useEffect(() => {
        const sess = sessions.find((s) => s.id === current && !s.tmp);
        if (!sess) {
            setMessages([]);
            return;
        } // tmp‑чат ⇒ пусто
        http.get(`/messages?session_id=${sess.id}`).then(({ data }) =>
            setMessages(
                data.map((m) => ({
                    id: m.id,
                    sender: m.is_user ? "user" : "backend",
                    type: m.type,
                    content: m.content,
                }))
            )
        );
    }, [current, sessions]);

    /* ───────── helpers ───────── */
    const addMsg = (sender, type, content) =>
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), sender, type, content },
        ]);

    /* ───────── tmp‑чат (клиент only) — «+ New chat» ───────── */
    function newSession() {
        // уже открыт пустой tmp‑чат → ничего не делаем
        if (
            current &&
            sessions.some((s) => s.id === current && s.tmp) &&
            messages.length === 0
        )
            return;

        // найдём «старый» пустой tmp‑чат
        const reusable = sessions.find(
            (s) => s.tmp && s.__empty && s.id !== current
        );
        if (reusable) {
            setCurrent(reusable.id);
            return;
        }

        // иначе создаём новый
        const tmp = {
            id: `tmp_${Date.now()}`,
            title: null,
            created_at: new Date(),
            tmp: true,
            __empty: true,
        };
        setSessions((prev) => [tmp, ...prev]);
        setCurrent(tmp.id);
    }

    /* ───────── превращаем tmp в настоящий (POST /sessions) ───────── */
    async function ensureRealSession() {
        const sess = sessions.find((s) => s.id === current);
        if (sess && !sess.tmp) return sess.id;

        const { data } = await http.post("/sessions");

        setSessions((prev) => prev.map((c) => (c.id === current ? data : c)));
        setCurrent(data.id);
        return data.id;
    }

    /* ───────── rename / delete ───────── */
    async function renameSession(id, title) {
        const { data } = await http.patch(`/sessions/${id}`, { title });
        setSessions((prev) => prev.map((c) => (c.id === id ? data : c)));
    }

    async function deleteSession(id) {
        await http.delete(`/sessions/${id}`);
        setSessions((prev) => prev.filter((c) => c.id !== id));

        if (current === id) {
            setCurrent(sessions.find((c) => !c.tmp)?.id ?? null);
            setMessages([]);
        }
    }

    /* ───────── отправка видео ───────── */
    async function sendVideo(file, previewUrl) {
        /* 1. показываем превью прямо сейчас */
        addMsg("user", "video", previewUrl);

        /* 2. если tmp‑чат был пуст — пометим его, НЕ создавая нового массива */
        setSessions((prev) => {
            let changed = false;
            const next = prev.map((c) => {
                if (c.id === current && c.__empty) {
                    changed = true;
                    return { ...c, __empty: false };
                }
                return c;
            });
            return changed ? next : prev; // важная оптимизация!
        });

        /* 3. убеждаемся, что чат есть в БД */
        const realId = await ensureRealSession();

        /* 4. шлём файл */
        const form = new FormData();
        form.append("file", file, file.name);

        try {
            const { data } = await http.post(
                `/predict?session_id=${realId}`,
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            addMsg("backend", "prediction", data); // ✓ ответ модели
        } catch (err) {
            addMsg(
                "backend",
                "error",
                `Ошибка: ${err.response?.data?.detail || err.message}`
            );
            throw err;
        }
    }

    /* ───────── ctx value ───────── */
    return (
        <ChatCtx.Provider
            value={{
                sessions,
                current,
                setCurrent,
                newSession,
                sendVideo,
                renameSession,
                deleteSession,
                messages,
            }}
        >
            {children}
        </ChatCtx.Provider>
    );
}
