import { useRef, useState } from "react";
import { Upload, ImagePlus } from "lucide-react";

export default function UploadZone({ onUpload, disabled }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file) return;
        const allowed = ["image/jpeg", "image/png", "image/webp", "application/dicom"];
        const isAllowed = allowed.includes(file.type) || file.name.endsWith(".dcm");
        if (!isAllowed) {
            alert("Please upload a valid medical image (JPG, PNG, WEBP, or DICOM)");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            const mimeType = file.type || "image/jpeg";
            onUpload({ base64, mimeType, fileName: file.name });
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div
            onClick={() => !disabled && inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`
        relative flex flex-col items-center justify-center
        w-full h-64 rounded-2xl border-2 border-dashed
        transition-all duration-300 cursor-pointer select-none
        ${disabled
                    ? "border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed"
                    : dragging
                        ? "border-purple-400 bg-purple-900/20 scale-[1.02]"
                        : "border-purple-700 bg-gray-900 hover:border-purple-500 hover:bg-purple-900/10"
                }
      `}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.dcm"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
                disabled={disabled}
            />

            <div className="flex flex-col items-center gap-3 pointer-events-none">
                {dragging ? (
                    <Upload size={40} className="text-purple-400 animate-bounce" />
                ) : (
                    <ImagePlus size={40} className="text-purple-600" />
                )}
                <p className="text-gray-300 text-sm font-medium">
                    {dragging ? "Drop your image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-gray-600 text-xs">
                    Supports JPG, PNG, WEBP, DICOM (.dcm)
                </p>
            </div>
        </div>
    );
}