// src/pages/ChatPage.jsx
import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat/Chat";
import { ChatCtx } from "../context/ChatContext";

export default function ChatPage({ create = false }) {
    const { id } = useParams(); // undefined | "new" | "123"
    const nav = useNavigate();
    const { current, setCurrent, newSession } = useContext(ChatCtx);

    /* 1. если /chat/new — создаём сессию и идём на неё */
    useEffect(() => {
        if (!create) return;
        (async () => {
            const { id: newId } = await newSession();
            nav(`/chat/${newId}`, { replace: true });
        })();
    }, [create]);

    /* 2. подменяем current, когда id в URL изменился  */
    useEffect(() => {
        if (id && +id !== current) setCurrent(+id);
    }, [id]);

    return <Chat />;
}
