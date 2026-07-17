export default function DropZone({ preview, loading, onPick, onDrop }) {
    return (
        <div
            className={`flex items-center justify-center mb-4 border-2 border-dashed border-[#888] rounded-xl min-h-[150px] cursor-pointer
                    ${preview ? "p-0" : "p-4"} ${loading ? "opacity-50" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={!preview ? onPick : undefined}
        >
            {preview ? (
                <video
                    src={preview}
                    controls
                    className="max-h-[150px] rounded-lg"
                />
            ) : (
                <span className="text-gray-400 text-center">
                    Перетащите видео сюда или{" "}
                    <button className="text-blue-400 hover:underline">
                        загрузите
                    </button>
                </span>
            )}
        </div>
    );
}
