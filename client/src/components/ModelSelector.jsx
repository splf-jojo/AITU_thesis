import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

function ModelSector() {
    // Список моделей без описания
    const models = [
        { name: "MViTv2-small-16-4" },
        // { name: "Swin-large-16-3" },
        // { name: "ResNet-i3d-16-3" },
    ];

    const [selected, setSelected] = useState(models[0]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Закрываем дропдаун при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (model) => {
        setSelected(model);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left m-4" ref={containerRef}>
            {/* Кнопка открытия дропдауна */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-[#212121] hover:bg-[#171717] text-white rounded-md transition duration-200"
                // onClick={() => setIsOpen(!isOpen)}
            >
                {selected ? selected.name : "Выбрать модель"}
                <FaChevronDown
                    className={`text-sm transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Выпадающий список моделей с шириной, равной кнопке */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-[#212121] border border-[#2f2f2f] rounded-md shadow-lg z-50">
                    <ul className="max-h-60 overflow-y-auto">
                        {models.map((model) => (
                            <li
                                key={model.name}
                                className="px-4 py-2 m-2 rounded-lg hover:bg-[#171717] cursor-pointer"
                                onClick={() => handleSelect(model)}
                            >
                                <div className="text-white font-medium">
                                    {model.name}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ModelSector;
