import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Product Name Generator | Premium SaaS",
    description: "Generate professional product names, brand scores, and ecommerce copy with AI.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body className={cn(inter.className, "h-full antialiased")}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
