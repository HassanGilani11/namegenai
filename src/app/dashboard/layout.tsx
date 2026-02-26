import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    console.log("[DashboardLayout] Session found:", !!session);

    if (!session) {
        console.log("[DashboardLayout] No session, redirecting to login");
        redirect("/login");
    }

    // Fetch credits for the sidebar
    // We fetch this in the layout so it's fresh on every page load
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    }) as any;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <Sidebar credits={user?.credits || 0} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
