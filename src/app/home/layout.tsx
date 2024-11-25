import { ErrorBoundary } from "react-error-boundary";
import { Metadata } from "next";
import { useGenerateMetadata } from "@/shared/usecase/useGenerateMetada";
import CustomErrorBoundary from "@/shared/container/custom-error-boundary/CustomErrorBoundary";

export const metadata: Metadata = useGenerateMetadata({
    pageTitle: "Home",
    description: "Ahmad Faiz's portfolio",
    canonicalPath: "/",
    keywords: [
        "Ahmad Faiz Agustianto",
        "Ahmad Faiz",
        "Faiz"
    ],
    type: "website",
});

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary FallbackComponent={CustomErrorBoundary}>
            <main className="grid grid-cols-12 grid-rows-12 gap-5 w-full h-[calc(100dvh-48px)]">
                {children}
            </main>
        </ErrorBoundary>
    );
}