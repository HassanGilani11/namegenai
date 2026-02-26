import Link from "next/link";
import { LucideZap, LucideCheckCircle, LucideGlobe, LucidePenTool } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 lg:px-12 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LucideZap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NameGen AI</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/#features" className="text-slate-300 hover:text-white transition-colors hidden md:block">Features</Link>
                    <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
                    <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                    <Link href="/login" className="text-slate-300 hover:text-white transition-colors hidden md:block">Log in</Link>
                    <Link href="/register" className="px-5 py-2.5 bg-white text-slate-950 rounded-full hover:bg-slate-200 transition-all font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Pricing Header */}
            <main className="flex-1 flex flex-col items-center px-4 pt-40 pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 relative overflow-hidden text-center">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
                    Simple, transparent pricing
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1] max-w-4xl">
                    Choose the right plan for your brand.
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-slate-400 mb-16 leading-relaxed">
                    Start for free, upgrade when you need more power and advanced features.
                </p>

                {/* Pricing Cards */}
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10 px-6">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col relative transition-all hover:border-slate-500">
                        <h3 className="text-2xl font-bold mb-2">Starter</h3>
                        <p className="text-slate-400 text-sm mb-6">Perfect to test the waters and discover ideas.</p>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold">$0</span>
                            <span className="text-slate-500 font-medium">/ forever</span>
                        </div>
                        <Link href="/register" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-center transition-all mb-8">
                            Get Started Free
                        </Link>
                        <ul className="space-y-4 text-sm text-slate-300 flex-1">
                            <li className="flex items-start gap-3 justify-center text-left">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>3 Free generation credits</span>
                            </li>
                            <li className="flex items-start gap-3 justify-center text-left">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Basic niche context</span>
                            </li>
                            <li className="flex items-start gap-3 justify-center text-left">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Single-word names</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/50 to-slate-900 border border-indigo-500/50 flex flex-col relative shadow-[0_0_40px_rgba(79,70,229,0.2)] transform md:-translate-y-4">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-indigo-100">Pro Creator</h3>
                        <p className="text-indigo-200/60 text-sm mb-6">Complete toolkit for serious founders.</p>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold">$19</span>
                            <span className="text-indigo-200/50 font-medium">/ month</span>
                        </div>
                        <Link href="/register" className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold text-center transition-all mb-8 shadow-lg shadow-indigo-500/25">
                            Start Pro Trial
                        </Link>
                        <ul className="space-y-4 text-sm text-indigo-100 flex-1">
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span className="font-semibold text-white">100 Premium Credits / month</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>Advanced brand sentiment scoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>Instant .com domain verification</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>AI Taglines & Mission statements</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>Save generated brand kits</span>
                            </li>
                        </ul>
                    </div>

                    {/* Team Plan */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col relative transition-all hover:border-slate-500">
                        <h3 className="text-2xl font-bold mb-2">Agency</h3>
                        <p className="text-slate-400 text-sm mb-6">For naming agencies and large portfolios.</p>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold">$49</span>
                            <span className="text-slate-500 font-medium">/ month</span>
                        </div>
                        <Link href="/register" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-center transition-all mb-8">
                            Get Started
                        </Link>
                        <ul className="space-y-4 text-sm text-slate-300 flex-1">
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Unlimited Premium Credits</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Everything in Pro</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>API Access for workflow integrations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Custom brand dictionary terms</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <LucideCheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Priority 24/7 Support</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 pt-16 pb-8 px-6 lg:px-12 bg-slate-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <LucideZap className="w-5 h-5 text-indigo-500" />
                            <span className="text-xl font-bold tracking-tight">NameGen AI</span>
                        </div>
                        <p className="text-slate-400 max-w-xs text-sm">Building the future of branding with artificial intelligence.</p>
                    </div>

                    <div className="flex gap-12 text-sm">
                        <div className="flex flex-col gap-3">
                            <span className="font-semibold text-white mb-1">Product</span>
                            <Link href="/#features" className="text-slate-400 hover:text-white transition-colors">Features</Link>
                            <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-semibold text-white mb-1">Company</span>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors">About</Link>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-semibold text-white mb-1">Legal</span>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
                <div className="text-center text-slate-600 text-sm pt-8 border-t border-white/5">
                    <p>© {new Date().getFullYear()} NameGen AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
