import { Lock, Zap, Clock } from "lucide-react";

export default function LimitBanner({ resetIn }) {
    return (
        <div className="w-full border border-purple-800/60 bg-purple-900/10 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">

            <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-700 flex items-center justify-center">
                <Lock size={22} className="text-purple-400" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-white font-semibold text-base">
                    Free limit reached
                </h3>
                <p className="text-gray-500 text-sm">
                    You've used your 3 free analyses for this session.
                </p>
                {resetIn && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <Clock size={12} className="text-gray-600" />
                        <span className="text-xs text-gray-600">
                            Resets in {resetIn} minutes
                        </span>
                    </div>
                )}
            </div>

            <div className="w-full border-t border-gray-800 pt-4 flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                    Upgrade to <span className="text-purple-400 font-semibold">BioIntel Pro</span> for:
                </p>
                <ul className="flex flex-col gap-2 text-left">
                    {[
                        "Unlimited medical image analysis",
                        "Drug discovery intelligence",
                        "Negative results database",
                        "Pharmacogenomics AI",
                        "Arabic genome data insights",
                    ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <Zap size={11} className="text-purple-500 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <a
                    href="https://axiom-biointel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors text-center"
                >
                    Upgrade to BioIntel Pro →
                </a>
            </div>

        </div>
    );
}