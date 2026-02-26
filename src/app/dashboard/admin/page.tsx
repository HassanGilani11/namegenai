
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { LucideUsers, LucideShieldCheck, LucideExternalLink, LucideHistory } from "lucide-react";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        include: { organization: true },
        orderBy: { createdAt: "desc" }
    });

    let billingHistory: any[] = [];
    try {
        if ((prisma as any).billingRecord) {
            billingHistory = await (prisma as any).billingRecord.findMany({
                include: { user: true, organization: true },
                orderBy: { createdAt: "desc" },
                take: 20
            });
        }
    } catch (error) {
        console.error("Failed to fetch billing history:", error);
    }

    return (
        <div className="p-10 max-w-6xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                        <LucideShieldCheck className="w-10 h-10 text-emerald-500" />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage platform users, billing, and system resources.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Card */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Users</p>
                    <p className="text-4xl font-black text-white">{users.length}</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-4xl font-black text-emerald-500">
                        {((billingHistory || []).reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pro Subscriptions</p>
                    <p className="text-4xl font-black text-indigo-400">{users.filter((u: any) => (u as any).plan === "PRO").length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <LucideUsers className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">Platform Users ({users.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Organization</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Plan</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Credits</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 border-b border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{user.name || "Anonymous"}</span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-300 font-medium">
                                                    {user.organization?.name || "No Org"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${(user as any).plan === "PRO" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
                                                }`}>
                                                {(user as any).plan}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-white/5 font-mono text-sm font-bold text-indigo-400">
                                            {(user as any).credits}
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === "ADMIN" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-slate-800 text-slate-500"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Billing History Card */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <LucideHistory className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Type</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {billingHistory.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 border-b border-white/5 text-sm text-slate-400">
                                            {new Date(record.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{record.user.name || "User"}</span>
                                                <span className="text-[10px] text-slate-500">{record.user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className="text-xs font-bold text-slate-300">{record.type.replace(/_/g, " ")}</span>
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
                                {billingHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-500 font-medium italic">No transactions yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
