"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideChevronLeft, LucideCreditCard, LucideZap, LucideLoader2, LucideHistory } from "lucide-react";

export default function BillingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }

        if (session) {
            fetchUserData();
            fetchHistory();
        }
    }, [status, session]);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/user/billing-history");
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/user/billing-info");
            const data = await res.json();
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch billing info:", error);
        }
    };

    const handleCheckout = async (type: "credits" | "subscription") => {
        try {
            setLoading(type);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setLoading(null);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <LucideLoader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-10 max-w-4xl mx-auto">

            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <LucideCreditCard className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Billing & Credits</h1>
                    <p className="text-slate-400">Manage your subscription and credit balance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Balance */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-all duration-700"></div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Current Balance</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl font-black text-white tracking-tighter">{userData?.credits || 0}</span>
                        <span className="text-indigo-400 font-bold">Credits</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">Pricing: $10 / 20 Credits</div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">Each generation costs 1 credit. Your balance is updated automatically after each successful run.</p>
                    <button
                        disabled={loading !== null}
                        onClick={() => handleCheckout("credits")}
                        className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading === "credits" ? <LucideLoader2 className="w-5 h-5 animate-spin" /> : <LucideZap className="w-5 h-5 fill-current" />}
                        Buy More Credits
                    </button>
                </div>

                {/* Current Plan */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Active Plan</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl font-black text-white tracking-tighter">{userData?.plan || "FREE"}</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-500 mb-6 uppercase tracking-widest">Pricing: $29 / month (100 Credits)</div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">You are currently on the {userData?.plan === "FREE" ? "Free Trial" : "Pro"} plan. Upgrade to unlock bulk generation and higher daily limits.</p>
                    <button
                        disabled={loading !== null}
                        onClick={() => handleCheckout("subscription")}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading === "subscription" ? <LucideLoader2 className="w-5 h-5 animate-spin" /> : (userData?.plan === "FREE" ? "Upgrade to Pro" : "Manage Subscription")}
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div className="mt-16 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                    <LucideHistory className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    {history.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Type</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((record) => (
                                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 border-b border-white/5 text-sm text-slate-300">
                                            {new Date(record.createdAt).toLocaleDateString("en-US", {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className="text-sm font-bold text-white">{record.type.replace(/_/g, " ")}</span>
                                        </td>
                                        <td className="p-4 border-b border-white/5 text-sm font-mono text-indigo-400 font-bold">
                                            {(record.amount / 100).toLocaleString("en-US", { style: "currency", currency: record.currency })}
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center">
                            <LucideHistory className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
                            <p className="text-slate-500 font-medium">No transactions found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
