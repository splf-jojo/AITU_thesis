// src/components/Chat/ChatMenu.jsx
import { useState, useRef, useEffect } from "react";

export default function ChatMenu({ onRename, onDelete }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState("");
    const ref = useRef(null);

    /* клик вне меню → закрыть */
    useEffect(() => {
        const h = (e) =>
            open && !ref.current.contains(e.target) && setOpen(false);
        window.addEventListener("mousedown", h);
        return () => window.removeEventListener("mousedown", h);
    }, [open]);

    if (editing) {
        return (
            <input
                autoFocus
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onBlur={() => {
                    setEditing(false);
                    val && onRename(val);
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                className="bg-[#303030] text-sm w-full rounded px-2 outline-none"
            />
        );
    }

    return (
        <div ref={ref} className="relative ml-2">
            {" "}
            {/* Контейнер для кнопки и меню */}
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-gray-200 p-1"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                ⋯
            </button>
            {open && (
                <div
                    // ИЗМЕНЕНО ЗДЕСЬ: позиционирование меню
                    className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#2a2a2a] py-1 shadow-xl z-50"
                    role="menu"
                >
                    <button
                        onClick={() => {
                            setVal(""); // Сбрасываем значение перед редактированием
                            setEditing(true);
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] text-sm text-white" // Добавил text-white для лучшей читаемости
                        role="menuitem"
                    >
                        Переименовать
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] text-sm text-red-400"
                        role="menuitem"
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
}
