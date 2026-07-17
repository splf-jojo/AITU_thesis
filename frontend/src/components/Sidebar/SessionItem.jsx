import ChatMenu from "../Chat/ChatMenu";

export default function SessionItem({
    s,
    current,
    collapsed,
    setCurrent,
    renameSession,
    deleteSession,
}) {
    const isActive = current === s.id;
    const dateLbl = `Чат ${new Date(s.created_at).toLocaleDateString()}`;
    const title = s.title || dateLbl;

    return (
        <li
            className={`mx-2 mb-1 flex items-center rounded-lg p-2 cursor-pointer
                  hover:bg-[#212121] relative h-9 ${
                      isActive ? "bg-[#212121]" : ""
                  }`}
            title={title}
            onClick={() => setCurrent(s.id)}
        >
            {/* серый маркер (виден только в collapsed) */}
            <span
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    h-2 w-2 rounded-full bg-gray-400 transition
                    ${
                        collapsed
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden={!collapsed}
            />

            {/* текст */}
            <span
                className={`flex-1 truncate text-white transition-all
                    ${
                        collapsed
                            ? "opacity-0 max-w-0 pointer-events-none"
                            : "opacity-100 max-w-full"
                    }`}
                aria-hidden={collapsed}
            >
                {title}
            </span>

            {/* меню ⋯ – только в раскрытом режиме и для активного чата */}
            {!collapsed && isActive && (
                <ChatMenu
                    onRename={(t) => renameSession(s.id, t)}
                    onDelete={() => deleteSession(s.id)}
                />
            )}
        </li>
    );
}
