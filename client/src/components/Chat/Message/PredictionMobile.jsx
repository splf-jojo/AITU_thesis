// src/components/Message/PredictionMobile.jsx
import { useCallback } from "react";

const API = "http://localhost:8000";

export default function PredictionMobile({ items = [] }) {
    /** проигрываем озвучку жеста */
    const play = useCallback((word) => {
        const url = `${API}/audio/${encodeURIComponent(word)}.mp3`;
        // автоплей возможен ТОЛЬКО в результате пользовательского клика
        console.log("url", url);
        new Audio(url).play().catch(console.error);
    }, []);

    return (
        <div className="flex flex-wrap gap-2">
            {items.slice(0, 5).map((p) => (
                <button
                    key={p.gesture}
                    onClick={() => play(p.gesture)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg active:scale-95"
                >
                    {p.gesture}
                </button>
            ))}
        </div>
    );
}
