//  src/pages/About.jsx  (светлая тема)
import { Link } from "react-router-dom";
import {
    FaGithub,
    FaVideo,
    FaBrain,
    FaDatabase,
    FaReact,
    FaPython,
} from "react-icons/fa";

export default function About() {
    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            {/* ---------- Header ---------- */}
            <header className="backdrop-blur bg-white/80 border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-wide text-gray-900 hover:text-blue-600 transition"
                    >
                        SLT&nbsp;— Sign&nbsp;Language&nbsp;Translator
                    </Link>
                    <Link
                        to="/"
                        className="text-sm rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        Вернуться в приложение
                    </Link>
                </div>
            </header>

            {/* ---------- Hero ---------- */}
            <section className="relative overflow-hidden">
                <div className="relative max-w-6xl mx-auto px-4 pb-30 pt-48 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Общайся на языке&nbsp;жестов&nbsp;—&nbsp;вместе
                        с&nbsp;AI
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-gray-600">
                        Приложение для перевода языка жестов в речь с
                        использованием упрощенной модели машинного обучения
                    </p>
                </div>
            </section>

            {/* ---------- Tech cards ---------- */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid gap-8 md:grid-cols-3">
                <Card
                    Icon={FaVideo}
                    iconColor="text-blue-500"
                    title="Захват и обработка видео"
                    text="Front-end позволяет перетаскивать файлы или записывать видео
                с веб-камеры. Бэкенд извлекает ключевые кадры, нормализует их и
                выбирает 32 сэмпла для инференса."
                />
                <Card
                    Icon={FaBrain}
                    iconColor="text-purple-500"
                    title="Нейронная сеть"
                    text="TorchScript-модель mvit32-small-16-4 обучена на датасете
                RWTH-PHOENIX-2020. Инференс выполняется на CPU или GPU —
                выбирается автоматически."
                />
                <Card
                    Icon={FaDatabase}
                    iconColor="text-green-600"
                    title="История и сессии"
                    text="PostgreSQL хранит чаты, сообщения и JSON-ответы модели. Видео
                сохраняются в каталог /media, а сообщения-плейсхолдеры ссылаются
                на их URL."
                />
            </section>

            {/* ---------- Stack icons ---------- */}
            <section className="bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8">
                    <Tech
                        icon={FaReact}
                        label="React 18 · Vite · Tailwind CSS"
                    />
                    <Tech icon={FaPython} label="FastAPI · Torch" />
                    <Tech icon={FaDatabase} label="PostgreSQL 16 · asyncpg" />
                    <Tech icon={FaGithub} label="Open-source MIT" />
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="text-center text-xs text-gray-500 py-6">
                2025 © SLT&nbsp;Team |{" "}
                <a
                    href="https://github.com/your-repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                >
                    GitHub
                </a>
            </footer>
        </div>
    );
}

/* -------------------- helpers -------------------- */
function Card({ Icon, iconColor, title, text }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <Icon size={30} className={`${iconColor} mb-4`} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
        </div>
    );
}

function Tech({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={26} className="text-blue-500" />
            <span className="text-sm text-gray-700">{label}</span>
        </div>
    );
}
