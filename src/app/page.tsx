import Link from "next/link";
import { LucideZap, LucideCheckCircle, LucideShield, LucideTrendingUp, LucidePenTool, LucideGlobe, LucideArrowRight, LucideCheck } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 lg:px-12 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LucideZap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NameGen AI</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="#features" className="text-slate-300 hover:text-white transition-colors hidden md:block">Features</Link>
                    <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
                    <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                    <Link href="/login" className="text-slate-300 hover:text-white transition-colors hidden md:block">Log in</Link>
                    <Link href="/register" className="px-5 py-2.5 bg-white text-slate-950 rounded-full hover:bg-slate-200 transition-all font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-40 pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    </span>
                    NameGen AI 2.0 is now live
                </div>

                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] max-w-5xl">
                    Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Perfect Name.</span> <br className="hidden md:block" />
                    Launch Faster.
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                    Stop brainstorming for hours. Our AI analyzes your niche, checks domain availability instantly, and generates high-converting brand names that stick.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/register" className="px-8 py-4 bg-indigo-600 rounded-full font-semibold hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 text-lg">
                        Get Started Free
                        <LucideArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="#features" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all flex items-center justify-center text-lg">
                        See it in action
                    </Link>
                </div>

                {/* Social Proof */}
                <div className="mt-20 pt-10 border-t border-white/5 w-full max-w-4xl">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">Trusted by founders at forward-thinking companies</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder logos using text for now, could be replaced with real SVG logos */}
                        <div className="text-xl font-black font-serif">Acme Corp</div>
                        <div className="text-xl font-bold tracking-tighter">GLOBALXYZ</div>
                        <div className="text-xl font-bold italic">TechFlow</div>
                        <div className="text-xl font-semibold tracking-widest">NEXUS</div>
                        <div className="text-xl font-black">Vertex</div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 md:px-12 bg-slate-950 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to build a brand.</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our platform goes beyond simple word generators. We provide a complete suite of tools to establish your market presence.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI Naming Engine",
                                desc: "Context-aware generation that understands your specific niche, audience, and preferred brand archetype.",
                                icon: <LucideZap className="w-6 h-6 text-indigo-400" />
                            },
                            {
                                title: "Instant Domain Checking",
                                desc: "Don't fall in love with a name you can't own. We verify .com and alternative extension availability in real-time.",
                                icon: <LucideGlobe className="w-6 h-6 text-blue-400" />
                            },
                            {
                                title: "Cultural Sentiment Scoring",
                                desc: "Ensure your brand name resonates positively across different languages and cultural contexts.",
                                icon: <LucideCheckCircle className="w-6 h-6 text-emerald-400" />
                            },
                            {
                                title: "High-Converting Copy",
                                desc: "Generate taglines, mission statements, and elevator pitches that perfectly match your new brand identity.",
                                icon: <LucidePenTool className="w-6 h-6 text-purple-400" />
                            },
                            {
                                title: "Market Positioning",
                                desc: "Analyze competitors and identify naming whitespace in your specific industry sector.",
                                icon: <LucideTrendingUp className="w-6 h-6 text-orange-400" />
                            },
                            {
                                title: "Enterprise Security",
                                desc: "Your unlaunched brand names and product ideas remain strictly confidential with bank-level encryption.",
                                icon: <LucideShield className="w-6 h-6 text-rose-400" />
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-left hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all duration-300 group">
                                <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10"></div>
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>

                <div className="max-w-4xl mx-auto text-center relative z-20 bg-slate-900/50 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[3rem]">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to launch your empire?</h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of founders who found their perfect brand identity using NameGen AI.</p>
                    <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 hover:scale-105 transition-all text-lg shadow-xl shadow-white/10">
                        Start Generating Free
                        <LucideArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="mt-6 text-sm text-slate-500">No credit card required for the Free tier.</p>
                </div>
            </section>

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
                            <Link href="#features" className="text-slate-400 hover:text-white transition-colors">Features</Link>
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
