// src/components/Chat/Chat.jsx
import { useContext } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import { ChatCtx } from "../../context/ChatContext";

export default function Chat() {
    const { current, messages } = useContext(ChatCtx);

    /* ───── placeholder, когда чат не выбран ───── */
    if (!current) {
        return (
            <div className="flex items-center justify-center h-full px-6">
                <p className="text-center text-xl text-gray-400">
                    Выберите существующий чат
                    <br />
                    или&nbsp;нажмите&nbsp;«New&nbsp;chat» в&nbsp;левом меню.
                </p>
            </div>
        );
    }

    /* ───── обычный вид, когда чат открыт ───── */
    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto h-full">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <MessageList messages={messages} />
            </div>

            <div className="flex-shrink-0 px-2">
                <InputArea /> {/* Инпут рендерится только при выбранном чате */}
            </div>
        </div>
    );
}
