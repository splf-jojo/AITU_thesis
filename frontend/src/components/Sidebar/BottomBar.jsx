import { Link } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function BottomBar({ collapsed, email, logout }) {
    return (
        <div
            className={`border-t border-[#212121] px-3 py-3 text-sm text-white
                  h-[70px] shrink-0 flex items-center relative
                  ${collapsed ? "justify-center" : "justify-start"}`}
        >
            {/* текстовое представление */}
            <div
                className={`overflow-hidden whitespace-nowrap transition-all
                    ${
                        collapsed
                            ? "opacity-0 max-w-0 pointer-events-none absolute"
                            : "opacity-100 max-w-full"
                    }`}
                aria-hidden={collapsed}
            >
                {email ? (
                    <>
                        Вы вошли как
                        <br />
                        <span className="font-medium block truncate">
                            {email}
                        </span>
                        <button
                            onClick={logout}
                            className="mt-1 text-red-400 hover:underline"
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Войти
                    </Link>
                )}
            </div>

            {/* иконка или кнопка при свернутом меню */}
            <div
                className={`transition-all
                    ${
                        collapsed
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden={!collapsed}
            >
                {email ? (
                    <button onClick={logout} aria-label="Logout">
                        <FaSignOutAlt size={18} className="text-red-400" />
                    </button>
                ) : (
                    <Link to="/login">
                        <FaUser size={18} className="text-blue-400" />
                    </Link>
                )}
            </div>
        </div>
    );
}
