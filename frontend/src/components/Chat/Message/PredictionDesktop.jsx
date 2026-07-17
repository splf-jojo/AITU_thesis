const Bar = ({ v }) => (
    <div className="w-full bg-gray-500 rounded-full h-1.5 my-1">
        <div
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(Math.max(v * 100, 0), 100)}%` }}
        />
    </div>
);

export default function PredictionDesktop({ items = [] }) {
    const top5 = items.slice(0, 5);
    return (
        <>
            <p className="font-semibold mb-2">
                Топ-{top5.length} распознанных жестов:
            </p>
            <ul className="space-y-2">
                {top5.map((p, i) => (
                    <li key={p.gesture}>
                        <div className="flex justify-between text-sm">
                            <span
                                className={
                                    i
                                        ? "font-medium"
                                        : "text-lg text-blue-300 font-medium"
                                }
                            >
                                {p.gesture}
                            </span>
                            <span
                                className={`text-xs ml-2 ${
                                    i
                                        ? "text-gray-400"
                                        : "text-blue-300 font-semibold"
                                }`}
                            >
                                {(p.probability * 100).toFixed(4)}%
                            </span>
                        </div>
                        <Bar v={p.probability} />
                    </li>
                ))}
            </ul>
        </>
    );
}
