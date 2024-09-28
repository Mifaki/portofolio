import "./globals.css";
import { Poppins } from "next/font/google";
import { useGenerateMetadata } from "@/shared/usecase/useGenerateMetada";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}antialiased w-full h-screen p-6`}
      >
        {children}
      </body>
    </html>
  );
}
