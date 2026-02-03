import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restricted Access", // A cute fake title for the browser tab
  description: "Classified relationship data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-screen w-screen overflow-hidden bg-black text-white selection:bg-green-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}