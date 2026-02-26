import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    LucideZap,
    LucideLayoutDashboard,
    LucideHistory,
    LucideCreditCard,
    LucideSettings,
    LucidePlus,
    LucideLogOut
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getDailyUsage } from "@/utils/usage-tracker";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Fetch some stats for the user
    const stats = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            credits: true,
            plan: true,
            _count: {
                select: { generations: true }
            }
        } as any
    }) as any;

    // Fetch 3 most recent generations
    const recentGenerations = await prisma.generation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3
    });
    // Fetch daily usage to sync with UI
    const usageCount = await getDailyUsage(session.user.id);
    const dailyLimit = (stats as any)?.plan === "FREE" ? 3 : 20;

    return (
        <div className="p-10">
            <header className="flex items-center justify-between mb-12 text-white">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Welcome back, {session.user.name || "User"}</h1>
                    <p className="text-slate-400">Ready to build your next big brand?</p>
                </div>
                <Link href="/dashboard/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 group text-white decoration-none">
                    <LucidePlus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Generation
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-white">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Generations</h3>
                    <p className="text-3xl font-bold">{stats?._count.generations || 0}</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Current Plan</h3>
                    <p className="text-3xl font-bold text-indigo-400">{stats?.plan || "FREE"}</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Daily Usage</h3>
                    <p className="text-3xl font-bold">{usageCount} / {dailyLimit}</p>
                </div>
            </div>

            {/* Recent Generations Section */}
            <div>
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <LucideHistory className="w-5 h-5 text-indigo-400" />
                        Recent Generations
                    </h2>
                    {recentGenerations.length > 0 && (
                        <Link href="/dashboard/history" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                            View all history →
                        </Link>
                    )}
                </div>

                {recentGenerations.length === 0 ? (
                    <div className="h-[300px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-white/[0.02]">
                        <LucideHistory className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg">No recent generations found.</p>
                        <p className="text-sm">Start by clicking the "New Generation" button.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {recentGenerations.map((gen: any) => (
                            <div key={gen.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs text-slate-500 font-mono">
                                        {new Date(gen.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20 uppercase tracking-widest">
                                        {gen.model}
                                    </div>
                                </div>
                                <p className="text-white text-md font-medium truncate mb-1">"{gen.prompt}"</p>
                                <div className="text-slate-400 text-sm line-clamp-2 italic">
                                    {gen.result}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
