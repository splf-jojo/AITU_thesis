import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import logo from "../../assets/logo2.png";

export default function Header({ collapsed, toggle }) {
    return (
        <div className="flex items-center justify-between px-3 py-4 shrink-0 h-[60px]">
            <Link
                to="/"
                className={`flex items-center transition-all
                    ${
                        collapsed
                            ? "opacity-0 max-w-0 pointer-events-none"
                            : "opacity-100 max-w-xs"
                    }`}
                aria-hidden={collapsed}
                tabIndex={collapsed ? -1 : 0}
            >
                <img src={logo} alt="logo" className="w-8 h-8 shrink-0" />
            </Link>

            {/* На мобилке кнопка не нужна – скрыта в бургер-меню */}
            <button
                onClick={toggle}
                className="text-gray-400 hover:text-gray-200 p-1 hidden md:block"
                aria-label={collapsed ? "Развернуть" : "Свернуть"}
            >
                {collapsed ? (
                    <HiChevronRight size={20} />
                ) : (
                    <HiChevronLeft size={20} />
                )}
            </button>
        </div>
    );
}
