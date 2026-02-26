import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title:       "WorkflowBrain",
  description: "AI-powered productivity for students and early professionals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col bg-surface text-slate-200 antialiased">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
