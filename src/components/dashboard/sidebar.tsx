"use client";

import { useSession, signOut } from "next-auth/react";
import {
    LucideZap,
    LucideLayoutDashboard,
    LucideHistory,
    LucideCreditCard,
    LucideSettings,
    LucideLogOut,
    LucideUser
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    credits: number;
}

export default function Sidebar({ credits }: SidebarProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const isAdmin = (session?.user as any)?.role === "ADMIN";

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LucideLayoutDashboard },
        { href: "/dashboard/history", label: "History", icon: LucideHistory },
        { href: "/dashboard/billing", label: "Billing", icon: LucideCreditCard },
        { href: "/dashboard/settings", label: "Settings", icon: LucideSettings },
        ...(isAdmin ? [{ href: "/dashboard/admin", label: "Admin Panel", icon: LucideUser }] : []),
    ];

    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "";
    const nameInitial = userName.charAt(0).toUpperCase();

    return (
        <aside className="w-72 border-r border-white/10 flex flex-col p-6 space-y-8 bg-slate-950/50 backdrop-blur-xl h-screen sticky top-0">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <LucideZap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">NameGen AI</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${isActive
                                ? "bg-white/5 border border-white/10 text-indigo-400 font-semibold"
                                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Your Credits</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-white">{credits}</p>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Available</span>
                </div>
                <Link href="/dashboard/billing" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors mt-2 block">
                    Upgrade Plan →
                </Link>
            </div>

            {/* User Profile Section */}
            <div className="pt-6 border-t border-white/5 space-y-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-2xl transition-all group/profile"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/10 transition-transform group-hover/profile:scale-105">
                        {nameInitial}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-white truncate group-hover/profile:text-indigo-400 transition-colors">{userName}</p>
                        <p className="text-[10px] text-slate-500 truncate font-medium">{userEmail}</p>
                    </div>
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-2xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 group"
                >
                    <LucideLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
