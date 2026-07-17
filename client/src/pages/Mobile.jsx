// src/pages/Mobile.jsx
import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";

import Chat from "../components/Chat/Chat";
import Sidebar from "../components/Sidebar/index";
import { ChatCtx } from "../context/ChatContext";

export default function Mobile() {
    const [showSidebar, setShowSidebar] = useState(false);

    /* -------- название текущего чата -------- */
    const { sessions, current } = useContext(ChatCtx);
    const title = useMemo(() => {
        const s = sessions.find((x) => x.id === current);
        if (!s) return "Chats";
        if (!s.title)
            return `Chat ${new Date(s.created_at).toLocaleDateString()}`;
        return s.title;
    }, [sessions, current]);

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#212121] relative">
            {/* ← back to home */}
            <Link
                to="/"
                className="absolute top-10 left-10 z-50 flex items-center justify-center
                   w-12 h-12 rounded-full bg-[#292929]/80 hover:bg-[#3a3a3a]/90
                   text-white transition"
            >
                <FaArrowLeft size={20} />
            </Link>

            {/* «телефон» */}
            <div className="relative w-[440px] h-[95vh] rounded-[2rem] bg-[#171717] shadow-2xl p-1 overflow-hidden">
                {/* ☰ open sidebar */}
                <button
                    onClick={() => setShowSidebar(true)}
                    className="absolute top-4 right-4 z-20 flex items-center justify-center
                     w-10 h-10 rounded-full hover:bg-[#3a3a3a]/90
                     text-white transition"
                >
                    <HiBars3 size={22} />
                </button>

                {/* ───── ЧАТ-TITLE + gradient ───── */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
                    <div className="h-14 bg-gradient-to-b from-[#171717] to-transparent flex items-center justify-center px-4">
                        <h1 className="text-center text-white text-sm font-medium truncate max-w-full">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* ───── overlay + Sidebar (inside phone) ───── */}
                {showSidebar && (
                    <>
                        <div
                            className="absolute inset-0 bg-black/60 z-10"
                            onClick={() => setShowSidebar(false)}
                        />
                        <div className="absolute inset-y-0 left-0 z-20 w-64">
                            <Sidebar />
                        </div>
                    </>
                )}

                {/* чат */}
                <Chat />
            </div>
        </div>
    );
}
