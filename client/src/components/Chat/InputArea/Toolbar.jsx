import { FaVideo, FaUpload } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
export default function Toolbar({
    loading,
    hasFile,
    onRecord,
    onPick,
    onSend,
}) {
    return (
        <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3">
                {/* запись */}
                <button
                    onClick={onRecord}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl text-white
                     border border-[#636363] hover:bg-[#292929] disabled:opacity-50"
                >
                    <FaVideo /> <span className="hidden sm:inline">Запись</span>
                </button>

                {/* загрузка */}
                <button
                    onClick={onPick}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl text-white
                     border border-[#636363] hover:bg-[#292929] disabled:opacity-50"
                >
                    <FaUpload />{" "}
                    <span className="hidden sm:inline">Загрузка</span>
                </button>
            </div>

            {/* отправить */}
            <button
                onClick={onSend}
                disabled={!hasFile || loading}
                className="flex items-center justify-center w-10 h-10 rounded-full
                   text-[#292929] bg-white disabled:opacity-50"
            >
                <IoSend />
            </button>
        </div>
    );
}
