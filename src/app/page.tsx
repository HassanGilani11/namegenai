import Link from "next/link";
import { LucideZap, LucideCheckCircle, LucideShield } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <LucideZap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NameGen AI</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/login" className="px-4 py-2 bg-white text-black rounded-full hover:bg-slate-200 transition-colors">SignIn</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
                    Perfect Names, <br />
                    Generated Instantly.
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                    The all-in-one AI platform for product naming, brand sentiment analysis, and high-converting ecommerce copy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard" className="px-8 py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2">
                        Get Started Free
                        <LucideZap className="w-4 h-4" />
                    </Link>
                    <Link href="#features" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all">
                        See it in action
                    </Link>
                </div>

                {/* Features Preview */}
                <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    {[
                        {
                            title: "AI Naming Engine",
                            desc: "Context-aware generation that understands your niche and target audience.",
                            icon: <LucideZap className="w-6 h-6 text-indigo-400" />
                        },
                        {
                            title: "Brand Scoring",
                            desc: "Instant feedback on memorability, domain availability, and cultural sentiment.",
                            icon: <LucideCheckCircle className="w-6 h-6 text-emerald-400" />
                        },
                        {
                            title: "Secure & Scalable",
                            desc: "Enterprise-grade security for your brand identity and data.",
                            icon: <LucideShield className="w-6 h-6 text-blue-400" />
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/50 transition-colors group">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-10 px-6 text-center text-slate-500 text-sm">
                <p>© 2026 NameGen AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
