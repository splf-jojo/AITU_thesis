import React, { useRef, useEffect } from "react";
import Message from "./Message/Message";

function MessageList({ messages }) {
    const listEndRef = useRef(null);

    useEffect(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-4 space-y-4">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
            ))}
            <div ref={listEndRef} />
        </div>
    );
}

export default MessageList;
