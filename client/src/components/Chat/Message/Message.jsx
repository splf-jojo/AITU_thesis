import { useLocation } from "react-router-dom";
import PredictionMobile from "./PredictionMobile";
import PredictionDesktop from "./PredictionDesktop";

const API = import.meta.env.VITE_API ?? "http://localhost:8000";

export default function Message({ message }) {
    const { pathname } = useLocation();
    const isMobile = pathname.startsWith("/mobile");

    const { sender, type, content } = message;
    const isUser = sender === "user";

    /* ---------- helpers ---------- */
    const getPredictions = () =>
        Array.isArray(content?.top_predictions)
            ? content.top_predictions
            : Array.isArray(content)
            ? content
            : null;

    /** Возвращает корректный src для тега <video> */
    const getVideoSrc = () => {
        if (!content) return null;
        /* blob-url из превью */
        if (typeof content === "string") return content;

        /* история с back-end’а */
        if (content.url) {
            const src = content.url.startsWith("http")
                ? content.url
                : `${API}${content.url}`;
            return src;
        }
        return null;
    };

    /* ---------- render ---------- */
    let body = null;

    /* Видео пользователя (превью) и видео из истории */
    if (type === "video") {
        const src = getVideoSrc();
        if (src)
            body = (
                <video
                    src={src}
                    controls
                    className="max-w-full h-auto rounded-md max-h-[300px]"
                />
            );
    }

    /* Ошибки */
    if (!body && type === "error")
        body = <span className="text-red-400">{content}</span>;

    /* Предсказания */
    const preds = !body && getPredictions();
    if (preds)
        body = isMobile ? (
            <PredictionMobile items={preds} />
        ) : (
            <PredictionDesktop items={preds} />
        );

    /* Fallback: отладочный вывод */
    if (!body)
        body = (
            <pre className="whitespace-pre-wrap break-all text-gray-300 text-xs">
                {typeof content === "object"
                    ? JSON.stringify(content, null, 2)
                    : String(content)}
            </pre>
        );

    /* ---------- wrapper ---------- */
    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
        >
            <div
                className={`rounded-lg break-words ${
                    isUser
                        ? "text-white max-w-[75%]"
                        : "bg-[#303030] text-white px-4 py-2 max-w-[60%]"
                }`}
            >
                {body}
            </div>
        </div>
    );
}
