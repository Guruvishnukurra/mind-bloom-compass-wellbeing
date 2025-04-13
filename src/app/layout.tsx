import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from 'react-error-boundary';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mind Bloom",
  description: "Your personal wellness companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong</div>}>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}