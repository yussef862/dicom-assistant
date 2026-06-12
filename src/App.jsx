import { useState } from "react";
import UploadZone from "./components/UploadZone";
import AnalysisResult from "./components/AnalysisResult";
import LimitBanner from "./components/LimitBanner";
import { getRateLimitStatus, recordUpload } from "./utils/rateLimit";
import { Dna, Loader2 } from "lucide-react";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState(getRateLimitStatus());

  const handleUpload = async ({ base64, mimeType, fileName }) => {
    const current = getRateLimitStatus();
    if (!current.allowed) {
      setStatus(current);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setFileName(fileName);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        recordUpload();
        setResult(data);
        setStatus(getRateLimitStatus());
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 py-12">

      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="flex items-center gap-2">
          <Dna size={28} className="text-purple-500" />
          <h1 className="text-2xl font-bold tracking-tight">
            AXIOM <span className="text-purple-400">BioIntel</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm text-center max-w-md">
          AI-powered medical image analysis — X-Ray & MRI
        </p>

        {/* Usage counter */}
        <div className="flex items-center gap-2 mt-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i < status.remaining ? "bg-purple-500" : "bg-gray-800"
                }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">
            {status.remaining}/3 analyses remaining
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl flex flex-col gap-6">

        {status.allowed ? (
          <UploadZone onUpload={handleUpload} disabled={loading} />
        ) : (
          <LimitBanner resetIn={status.resetIn} />
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 size={32} className="text-purple-500 animate-spin" />
            <p className="text-sm text-gray-500">Analyzing image...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/10 border border-red-800/40 rounded-xl p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <AnalysisResult result={result} fileName={fileName} />
        )}

      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-gray-800 text-center">
        AXIOM BioIntel AI · Not a substitute for professional medical advice
      </p>

    </div>
  );
}