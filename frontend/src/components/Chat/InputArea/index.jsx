import { useState, useRef, useContext } from "react";
import DropZone from "./DropZone";
import Toolbar from "./Toolbar";
import RecorderModal from "./RecorderModal";
import { ChatCtx } from "../../../context/ChatContext";

export default function InputArea() {
    const [file, setFile] = useState(null);
    const [preview, setPrev] = useState(null);
    const [loading, setLoad] = useState(false);
    const [rec, setRec] = useState(false); // modal flag
    const inputRef = useRef(null);

    const { sendVideo } = useContext(ChatCtx);

    /* -------- file helpers -------- */
    const accept = (f) => {
        setFile(f);
        setPrev(URL.createObjectURL(f));
    };
    const pickFile = () => inputRef.current?.click();
    const onChange = (e) => accept(e.target.files[0]);
    const onDrop = (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        f?.type.startsWith("video/")
            ? accept(f)
            : alert("Пожалуйста, перетащите видеофайл.");
    };

    /* -------- send -------- */
    const send = async () => {
        if (!file || loading) return;
        setLoad(true);
        try {
            await sendVideo(file, preview);
        } finally {
            setFile(null);
            setPrev(null);
            setLoad(false);
        }
    };

    return (
        <>
            {rec && (
                <RecorderModal
                    onCancel={() => setRec(false)}
                    onSave={(f) => {
                        setRec(false);
                        accept(f);
                    }}
                />
            )}

            <div
                className="p-4 mb-4 rounded-3xl shadow-md flex flex-col
                      border border-[#6363634f] bg-[#303030] w-full"
            >
                <DropZone
                    preview={preview}
                    loading={loading}
                    onPick={pickFile}
                    onDrop={onDrop}
                />

                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={onChange}
                    disabled={loading}
                />

                <Toolbar
                    loading={loading}
                    hasFile={!!file}
                    onRecord={() => setRec(true)}
                    onPick={pickFile}
                    onSend={send}
                />
            </div>
        </>
    );
}
