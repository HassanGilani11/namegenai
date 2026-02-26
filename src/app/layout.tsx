import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "NameGen AI | Perfect Product Names Generated Instantly",
        template: "%s | NameGen AI"
    },
    description: "The all-in-one AI platform for product naming, domain scanning, brand sentiment analysis, and high-converting ecommerce copy.",
    keywords: ["AI name generator", "product naming tool", "brand name generator", "ecommerce copy", "domain availability"],
    authors: [{ name: "NameGen AI" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://namegenai-lake.vercel.app/",
        title: "NameGen AI | Perfect Product Names Generated Instantly",
        description: "Generate professional product names, verify domain availability, and get instant brand sentiment scoring using our advanced AI engine.",
        siteName: "NameGen AI",
    },
    twitter: {
        card: "summary_large_image",
        title: "NameGen AI | Discover Your Perfect Brand Name",
        description: "The all-in-one platform for AI-powered product naming and ecommerce copy.",
        creator: "@NameGenAI",
    },
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
