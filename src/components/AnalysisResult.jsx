import { useState } from "react";
import { Copy, Check, AlertTriangle, Brain, Microscope, Activity, Shield } from "lucide-react";

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors px-2 py-1 rounded-md hover:bg-purple-900/20"
        >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

function Section({ icon: Icon, label, children, copyText }) {
    return (
        <div className="border border-gray-800 rounded-xl p-4 flex flex-col gap-3 bg-gray-900/60">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={15} className="text-purple-400" />
                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                        {label}
                    </span>
                </div>
                <CopyButton text={copyText} />
            </div>
            {children}
        </div>
    );
}

function ConfidenceBadge({ level }) {
    const colors = {
        low: "text-red-400 bg-red-900/20 border-red-800",
        medium: "text-yellow-400 bg-yellow-900/20 border-yellow-800",
        high: "text-green-400 bg-green-900/20 border-green-800",
    };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[level] || colors.medium}`}>
            {level?.toUpperCase()} CONFIDENCE
        </span>
    );
}

export default function AnalysisResult({ result, fileName }) {
    if (!result) return null;

    const fullText = `
MODALITY: ${result.modality}
REGION: ${result.region}

FINDINGS:
${result.findings?.map((f, i) => `${i + 1}. ${f}`).join("\n")}

IMPRESSION:
${result.impression}

${result.disclaimer}
  `.trim();

    return (
        <div className="flex flex-col gap-4 w-full">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-sm text-gray-400">
                        Analysis complete —{" "}
                        <span className="text-gray-300 font-medium">{fileName}</span>
                    </span>
                </div>
                <ConfidenceBadge level={result.confidence} />
            </div>

            {/* Modality + Region */}
            <Section
                icon={Brain}
                label="Scan Info"
                copyText={`${result.modality} — ${result.region}`}
            >
                <div className="flex gap-3">
                    <div className="flex-1 bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Modality</p>
                        <p className="text-sm text-white font-medium">{result.modality}</p>
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Region</p>
                        <p className="text-sm text-white font-medium">{result.region}</p>
                    </div>
                </div>
            </Section>

            {/* Findings */}
            <Section
                icon={Microscope}
                label="Findings"
                copyText={result.findings?.join("\n")}
            >
                <ul className="flex flex-col gap-2">
                    {result.findings?.map((finding, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-900/50 border border-purple-700 text-purple-300 text-xs flex items-center justify-center flex-shrink-0">
                                {i + 1}
                            </span>
                            <span className="text-sm text-gray-300 leading-relaxed">{finding}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Impression */}
            <Section
                icon={Activity}
                label="Impression"
                copyText={result.impression}
            >
                <p className="text-sm text-gray-300 leading-relaxed">{result.impression}</p>
            </Section>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-yellow-900/10 border border-yellow-800/40 rounded-xl p-4">
                <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-600 leading-relaxed">{result.disclaimer}</p>
            </div>

            {/* Copy All + AXIOM Badge */}
            <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-700 flex items-center gap-1">
                    <Shield size={11} />
                    Analyzed by AXIOM BioIntel AI
                </span>
                <CopyButton text={fullText} />
            </div>

        </div>
    );
}