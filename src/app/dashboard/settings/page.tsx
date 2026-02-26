"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    LucideSettings,
    LucideUser,
    LucideShield,
    LucideLoader2,
    LucideCheckCircle2,
    LucideAlertCircle,
    LucideEye,
    LucideEyeOff
} from "lucide-react";

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    // Form states
    const [name, setName] = useState(session?.user?.name || "");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Status states
    const [loading, setLoading] = useState<"profile" | "password" | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Sync name with session once loaded
    useEffect(() => {
        if (session?.user?.name && !name) {
            setName(session.user.name);
        }
    }, [session?.user?.name]);

    // Handle redirection safely in useEffect
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "unauthenticated") return null;

    const handleSaveName = async () => {
        if (!name) return;

        setLoading("profile");
        setMessage(null);

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: data.message });
                // Update local session
                await update({ name });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update profile" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setLoading(null);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setLoading("password");
        setMessage(null);

        try {
            const res = await fetch("/api/user/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: data.message });
                setNewPassword("");
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update password" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setLoading(null);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <LucideLoader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <LucideSettings className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="text-slate-400">Manage your profile, security, and notification preferences.</p>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                    }`}>
                    {message.type === "success" ? <LucideCheckCircle2 className="w-5 h-5" /> : <LucideAlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="p-1 border border-white/10 rounded-[36px] bg-white/5">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <LucideUser className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold">Profile Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-black tracking-widest pl-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all text-white font-medium"
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-black tracking-widest pl-1">Email Address</label>
                                <input
                                    type="email"
                                    disabled
                                    value={session?.user?.email || ""}
                                    className="w-full px-5 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-slate-500 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>
                        <button
                            disabled={loading === "profile" || name === session?.user?.name}
                            onClick={handleSaveName}
                            className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading === "profile" && <LucideLoader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Security Section */}
                <div className="p-1 border border-white/10 rounded-[36px] bg-white/5">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <LucideShield className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold">Security</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
                                <div>
                                    <p className="font-bold mb-1">Update Password</p>
                                    <p className="text-sm text-slate-500">Ensure your account is using a strong, unique password.</p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1 w-full space-y-2">
                                        <label className="text-xs text-slate-500 uppercase font-black tracking-widest pl-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-950 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all text-white font-medium pr-12"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <LucideEyeOff className="w-5 h-5" /> : <LucideEye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading === "password" || !newPassword}
                                        onClick={handleUpdatePassword}
                                        className="h-[58px] px-8 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading === "password" && <LucideLoader2 className="w-4 h-4 animate-spin" />}
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
