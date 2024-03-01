import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "~/components/Navbar";
import { cn } from "~/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn("relative h-full font-sans antialiased", inter.className)}
      >
        
        <main className="relative flex min-h-screen flex-col">
          <TRPCReactProvider> 
          <NavBar />          
            <div className="flex-grow flex-1">
              {children}
            </div>
          </TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}