"use client";

import { useState } from "react";
import Link from "next/link";
import { LucideChevronLeft, LucideZap, LucideSparkles, LucideWand2, LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewGenerationPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    const models = [
        { id: "gpt-4o-mini", name: "GPT-4o Mini", desc: "OpenAI: Fast & Smart", icon: <LucideZap className="w-4 h-4" /> },
        { id: "gpt-4o", name: "GPT-4o", desc: "OpenAI: Best Performance", icon: <LucideSparkles className="w-4 h-4" /> },
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "Google: Newest Flash", icon: <LucideZap className="w-4 h-4 text-blue-400" /> },
        { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "Google: Newest Pro", icon: <LucideWand2 className="w-4 h-4 text-blue-400" /> },
        { id: "gemini-1.5-flash-latest", name: "Gemini 1.5 Flash", desc: "Google: Ultra Fast", icon: <LucideZap className="w-4 h-4 text-blue-400" /> },
        { id: "gemini-1.5-pro-latest", name: "Gemini 1.5 Pro", desc: "Google: Intelligent", icon: <LucideWand2 className="w-4 h-4 text-blue-400" /> },
        { id: "gemini-2.0-pro-exp-02-05", name: "Gemini 2.0 Pro Exp", desc: "Google: Extreme Logic", icon: <LucideSparkles className="w-4 h-4 text-blue-400" /> },
    ];

    const currentModel = models.find(m => m.id === selectedModel) || models[0];

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please enter a description for your product.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    model: selectedModel
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || "Something went wrong");
            }

            setResult(data.data.result);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-6xl mx-auto p-6 md:p-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-6">
                        <Link href="/dashboard" className="group inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all duration-300">
                            <LucideChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold tracking-tight uppercase">Dashboard</span>
                        </Link>
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
                                New Identity.
                            </h1>
                            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
                                Fuel your next venture with AI-driven brand concepts and creative naming.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl">
                        <div className="px-4 py-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                            <span className="text-xs font-black uppercase tracking-widest text-white">PRO MODE</span>
                        </div>
                        <div className="px-3 pr-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Tier</span>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Input Selection Side */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="relative h-[650px] bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
                            <div className="flex-1 p-8 md:p-10 overflow-y-auto space-y-10 custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Select Engine</label>
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">OpenAI Integration</span>
                                    </div>

                                    {/* Custom Model Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowOptions(!showOptions)}
                                            className="w-full flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group/btn"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform ${currentModel.id.startsWith('gemini') ? 'bg-blue-500/10 text-blue-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                    {currentModel.icon}
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-white leading-none mb-1">{currentModel.name}</div>
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{currentModel.desc}</div>
                                                </div>
                                            </div>
                                            <LucideZap className={`w-4 h-4 transition-transform duration-500 ${showOptions ? 'rotate-180 text-indigo-400' : 'text-slate-600'}`} />
                                        </button>

                                        {showOptions && (
                                            <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-2 gap-1">
                                                {models.map((m) => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => {
                                                            setSelectedModel(m.id);
                                                            setShowOptions(false);
                                                        }}
                                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${selectedModel === m.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400'}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedModel === m.id ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                                                            {m.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className={`text-xs font-bold ${selectedModel === m.id ? 'text-white' : ''}`}>{m.name}</div>
                                                            <div className="text-[9px] uppercase tracking-widest opacity-60 font-medium">{m.desc}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Product Vision</label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full h-48 px-8 py-7 bg-white/5 border border-white/10 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all text-white placeholder:text-slate-600 leading-relaxed font-medium resize-none shadow-inner"
                                            placeholder="Describe your product's soul..."
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            disabled={loading}
                                        />
                                        <div className="absolute bottom-6 right-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                            {prompt.length} Characters
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-[20px] text-red-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt.trim()}
                                    className="relative w-full overflow-hidden rounded-[24px] cursor-pointer disabled:cursor-not-allowed group/main active:scale-[0.98] transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="relative py-6 bg-transparent rounded-[24px] font-black text-xs uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3">
                                        <LucideSparkles className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                                        {loading ? "Forging Identity..." : "Forge Identity"}
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Limit Recommendation Section */}
                        {error?.toLowerCase().includes("limit reached") ? (
                            <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                                        <LucideSparkles className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Limit Reached</h4>
                                        <p className="text-[13px] text-slate-400 leading-relaxed">
                                            You've reached your daily generation limit. Upgrade to <strong>Pro Mode</strong> for unlimited creations and access to high-performance engines.
                                        </p>
                                        <Link
                                            href="/dashboard/billing"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                        >
                                            <LucideZap className="w-3 h-3" />
                                            Upgrade to Pro
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : error && (error.toLowerCase().includes("quota") || error.toLowerCase().includes("busy")) ? (
                            <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[32px] animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                                        <LucideSparkles className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">Service Busy</h4>
                                        <p className="text-[13px] text-slate-400 leading-relaxed">
                                            {currentModel.name} is currently experiencing high load. Try switching to another high-performance engine.
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {models.filter(m => m.id !== selectedModel).slice(0, 2).map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => {
                                                        setSelectedModel(m.id);
                                                        setError("");
                                                    }}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest transition-colors cursor-pointer"
                                                >
                                                    Switch to {m.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <aside className="lg:col-span-5 space-y-8 sticky top-12">
                        <div className="relative h-[650px] bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden group/dossier">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-50 pointer-events-none" />
                            <div className="p-8 border-b border-white/5 flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-400/20 rounded-lg flex items-center justify-center text-indigo-400">
                                        <LucideSparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Brand Dossier</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Saved to History</div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{selectedModel}</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar z-10">
                                {result ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        {/* Reformatted Dossier for better UX */}
                                        <div className="prose prose-invert max-w-none">
                                            <div className="space-y-4">
                                                {result.split('\n\n').map((section, idx) => (
                                                    <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
                                                        {section.trim().startsWith('**') ? (
                                                            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                                                                {section}
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-200 leading-relaxed whitespace-pre-line text-[15px]">
                                                                {section}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(result);
                                                alert("Dossier copied to clipboard!");
                                            }}
                                            className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-full w-fit"
                                        >
                                            Copy Brand Dossier
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                            <LucideSparkles className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <div className="text-sm font-black text-white uppercase tracking-[0.2em] mb-3">Awaiting Concept</div>
                                        <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Your brand identity will manifest here after you click generate.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading && (
                            <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] space-y-6 animate-pulse">
                                <LucideLoader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-800 rounded-full" />
                                    <div className="h-2 w-[80%] bg-slate-800 rounded-full" />
                                </div>
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </div>
    );
}
