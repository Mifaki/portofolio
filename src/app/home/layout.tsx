import { ErrorBoundary } from "react-error-boundary";
import CustomErrorBoundary from "@/shared/container/custom-error-boundary/CustomErrorBoundary";

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary FallbackComponent={CustomErrorBoundary}>
            <main className="grid grid-cols-12 grid-rows-12 gap-5 w-full h-full">
                {children}
            </main>
        </ErrorBoundary>
    );
}