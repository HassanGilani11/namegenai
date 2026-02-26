import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LucideHistory } from "lucide-react";

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const generations = await prisma.generation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <LucideHistory className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Generation History</h1>
                    <p className="text-slate-400">View and manage your previous brand name generations.</p>
                </div>
            </div>

            {generations.length === 0 ? (
                <div className="p-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-white/[0.02]">
                    <LucideHistory className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg">No generations yet.</p>
                    <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-semibold mt-2">Start your first generation →</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {generations.map((gen) => (
                        <div key={gen.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-sm text-slate-500 font-mono">
                                    {new Date(gen.createdAt).toLocaleDateString()}
                                </div>
                                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 uppercase tracking-widest">
                                    {gen.model}
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-bold">Prompt</p>
                            <p className="text-white mb-6 bg-black/30 p-4 rounded-2xl border border-white/5 italic">"{gen.prompt}"</p>
                            <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-bold">Results</p>
                            <div className="text-lg font-medium text-indigo-100 whitespace-pre-wrap leading-relaxed">
                                {gen.result}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
