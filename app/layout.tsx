import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { SessionTimeoutWarning } from "@/components/auth/SessionTimeoutWarning";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BuffrLend - Fast, Fair, and Responsible Lending",
  description: "Quick loans for private sector employees. Get the cash you need with transparent 15% interest rates. No credit bureau checks. Automated salary deduction. Apply in minutes.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="buffrlend">
      <head>
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="buffrlend"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <SessionTimeoutWarning />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
