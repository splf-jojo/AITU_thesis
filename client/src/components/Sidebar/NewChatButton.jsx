import { FaHandSpock } from "react-icons/fa";

export default function NewChatButton({ collapsed, onClick }) {
    const base =
        "w-full inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 " +
        "h-9 px-4 text-sm font-medium text-white active:scale-95 transition-all relative";

    return (
        <div className="px-3 mb-3 shrink-0">
            <button onClick={onClick} className={base}>
                {/* иконка слева при развернутой панели */}
                <span
                    className={`transition-all shrink-0 ${
                        collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
                    }`}
                >
                    <FaHandSpock size={16} />
                </span>

                {/* текст */}
                <span
                    className={`overflow-hidden whitespace-nowrap transition-all
                      ${
                          collapsed
                              ? "max-w-0 opacity-0"
                              : "max-w-full opacity-100 ml-2"
                      }`}
                    aria-hidden={collapsed}
                >
                    Новый чат
                </span>

                {/* иконка по центру при свернутой панели */}
                {collapsed && (
                    <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        aria-hidden={!collapsed}
                    >
                        <FaHandSpock size={16} />
                    </span>
                )}
            </button>
        </div>
    );
}
