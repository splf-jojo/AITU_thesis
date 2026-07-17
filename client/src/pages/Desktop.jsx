import Sidebar from "../components/Sidebar/index";
import ModelSelector from "../components/ModelSelector";
import Chat from "../components/Chat/Chat";

/** ВЗЯТО 1‑в‑1 из вашего App.jsx */
export default function Desktop() {
    return (
        <div className="h-screen flex overflow-hidden bg-[#171717] text-whit">
            <Sidebar />

            {/* колонки */}
            <div className="flex-1 flex flex-col xl:flex-row bg-[#212121] overflow-y-auto">
                {/* левая узкая колонка */}
                <div className="p-2 xl:w-60 flex-shrink-0">
                    <ModelSelector />
                </div>

                {/* чат */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Chat />
                </div>

                {/* пустая правая колонка (если нужна) */}
                <div className="xl:w-60 flex-shrink-0 hidden xl:block" />
            </div>
        </div>
    );
}
