import { useEffect, useRef, useState } from "react";

export default function RecorderModal({ onCancel, onSave }) {
    const videoRef = useRef(null);
    const mediaStream = useRef(null);
    const recorder = useRef(null);
    const chunks = useRef([]);
    const [recording, setRecording] = useState(false);

    /* ───── получение камеры ───── */
    useEffect(() => {
        (async () => {
            try {
                mediaStream.current = await navigator.mediaDevices.getUserMedia(
                    {
                        video: true,
                        audio: true,
                    }
                );
                videoRef.current.srcObject = mediaStream.current;
                videoRef.current.play();
            } catch (e) {
                alert("Не удалось получить камеру");
                onCancel();
            }
        })();

        // stop on unmount
        return () => {
            mediaStream.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    /* ───── start / stop ───── */
    const start = () => {
        chunks.current = [];
        recorder.current = new MediaRecorder(mediaStream.current, {
            mimeType: "video/webm; codecs=vp9",
        });
        recorder.current.ondataavailable = (e) => chunks.current.push(e.data);
        recorder.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: "video/webm" });
            const file = new File([blob], `record_${Date.now()}.webm`, {
                type: blob.type,
            });
            onSave(file);
        };
        recorder.current.start();
        setRecording(true);
    };

    const stop = () => {
        recorder.current.stop();
        setRecording(false);
    };

    /* ───── UI ───── */
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#1e1e1e] rounded-2xl p-4 w-[420px]">
                <video
                    ref={videoRef}
                    className="w-full h-[236px] bg-black rounded-lg mb-4"
                    playsInline
                    muted
                />
                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 rounded-xl bg-gray-600 hover:bg-gray-500 text-white"
                        onClick={onCancel}
                        disabled={recording}
                    >
                        Cancel
                    </button>
                    {recording ? (
                        <button
                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white"
                            onClick={stop}
                        >
                            Stop
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white"
                            onClick={start}
                        >
                            Record
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
