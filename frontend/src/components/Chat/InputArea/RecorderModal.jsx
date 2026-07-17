import { useEffect, useRef, useState } from "react";

const MIME_TYPES = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
];

function getRecorderOptions() {
    const mimeType = MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
    return mimeType ? { mimeType } : undefined;
}

export default function RecorderModal({ onCancel, onSave }) {
    const videoRef = useRef(null);
    const mediaStream = useRef(null);
    const recorder = useRef(null);
    const chunks = useRef([]);
    const [recording, setRecording] = useState(false);
    const [cameraState, setCameraState] = useState("loading");
    const [cameraError, setCameraError] = useState("");

    /* ───── получение камеры ───── */
    useEffect(() => {
        let disposed = false;

        const openCamera = async () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraState("error");
                setCameraError("Браузер не поддерживает доступ к камере.");
                return;
            }

            try {
                // Для распознавания жестов нужен видеопоток; микрофон не нужен.
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (disposed) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                mediaStream.current = stream;
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => undefined);
                setCameraState("ready");
            } catch (error) {
                console.error("Camera access failed", error);
                if (!disposed) {
                    setCameraState("error");
                    setCameraError("Разрешите доступ к камере и попробуйте снова.");
                }
            }
        };

        openCamera();

        return () => {
            disposed = true;
            const activeRecorder = recorder.current;
            if (activeRecorder && activeRecorder.state !== "inactive") {
                activeRecorder.onstop = null;
                activeRecorder.stop();
            }
            mediaStream.current?.getTracks().forEach((t) => t.stop());
            mediaStream.current = null;
        };
    }, []);

    /* ───── start / stop ───── */
    const start = () => {
        const stream = mediaStream.current;
        if (!stream?.active || !stream.getVideoTracks().some((track) => track.readyState === "live")) {
            setCameraState("error");
            setCameraError("Камера ещё не готова. Подождите или разрешите доступ к ней.");
            return;
        }

        if (!window.MediaRecorder) {
            setCameraState("error");
            setCameraError("Ваш браузер не поддерживает запись видео.");
            return;
        }

        chunks.current = [];
        try {
            const recorderOptions = getRecorderOptions();
            const activeRecorder = recorderOptions
                ? new MediaRecorder(stream, recorderOptions)
                : new MediaRecorder(stream);
            recorder.current = activeRecorder;

            activeRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunks.current.push(event.data);
            };
            activeRecorder.onstop = () => {
                setRecording(false);
                if (!chunks.current.length) {
                    setCameraError("Не удалось получить видеозапись.");
                    return;
                }

                const blob = new Blob(chunks.current, {
                    type: activeRecorder.mimeType || "video/webm",
                });
                onSave(
                    new File([blob], `record_${Date.now()}.webm`, {
                        type: blob.type,
                    })
                );
            };
            activeRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("MediaRecorder failed", error);
            setCameraError("Не удалось начать запись видео.");
        }
    };

    const stop = () => {
        if (recorder.current?.state === "recording") recorder.current.stop();
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
                    autoPlay
                />
                <p
                    className={`mb-4 text-sm ${
                        cameraState === "error" ? "text-red-400" : "text-gray-300"
                    }`}
                >
                    {cameraError ||
                        (cameraState === "loading" ? "Подключаем камеру…" : "Камера готова")}
                </p>
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
                            disabled={cameraState !== "ready"}
                        >
                            Record
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
