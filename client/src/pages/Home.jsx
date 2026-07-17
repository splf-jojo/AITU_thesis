import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

import logo from "../assets/logo2.png"; // если логотип не нужен — удалите

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-200 px-4">
            {/* Заголовок */}
            <Link
                to="/about" // Укажите правильный путь к вашей странице "О нас"
                className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center text-md font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 z-10"
            >
                <span>О нас</span>
                <FaExternalLinkAlt className="ml-3 h-4 w-4" />{" "}
                {/* Иконка стрелки с отступом */}
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-center">
                Sign&nbsp;
                <span className="text-blue-600">Language</span>
                &nbsp;Translator
            </h1>

            {/* Дополнительный слоган */}

            <p className="text-2xl md:text-3xl font-semibold mb-12 text-center">
                Говорите с помощью рук
            </p>

            {/* Кнопки */}

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Chat */}

                <Link
                    to="/desktop"
                    className="flex flex-col items-center rounded-xl px-10 py-6 shadow-lg

          bg-white/70 backdrop-blur hover:scale-[1.03] transition-transform"
                >
                    <span className="text-2xl font-semibold mb-2">
                        Компьютерная версия
                    </span>

                    <span className="text-sm text-gray-600 text-center">
                        Откройте окно чата
                        <br />с переводчиком жестового языка
                    </span>
                </Link>

                {/* 2. Mobile Web App */}

                <Link
                    to="/mobile"
                    className="flex flex-col items-center rounded-xl px-10 py-6 shadow-lg

                     bg-white/70 backdrop-blur hover:scale-[1.03] transition-transform"
                >
                    <span className="text-2xl font-semibold mb-2">
                        Мобильное веб-приложение
                    </span>

                    <span className="text-sm text-gray-600 text-center">
                        Используйте переводчик
                        <br />
                        на мобильном устройстве
                    </span>
                </Link>
            </div>
        </div>
    );
}
