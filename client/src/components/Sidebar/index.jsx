import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatCtx } from "../../context/ChatContext";
import { AuthCtx } from "../../context/AuthContext";

import Header from "./Header";
import NewChatButton from "./NewChatButton";
import SessionList from "./SessionList";
import BottomBar from "./BottomBar";

export default function Sidebar() {
    const { pathname } = useLocation();
    const isMobile = pathname.startsWith("/mobile");

    const chatCtx = useContext(ChatCtx); // sessions, newSession ...
    const { email, logout } = useContext(AuthCtx);

    const [open, setOpen] = useState(true);
    const collapsed = !isMobile && !open;

    return (
        <aside
            className={`h-full flex flex-col bg-[#171717] transition-all duration-300
                  ${collapsed ? "w-16" : "w-64"}`}
        >
            <Header collapsed={collapsed} toggle={() => setOpen(!open)} />

            <NewChatButton collapsed={collapsed} onClick={chatCtx.newSession} />

            <SessionList
                collapsed={collapsed}
                {...chatCtx} /* передаём sessions, current, ... */
            />

            <BottomBar collapsed={collapsed} email={email} logout={logout} />
        </aside>
    );
}
