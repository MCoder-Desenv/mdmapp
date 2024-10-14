import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { SideBar } from "@/components/sideBar";
import { AuthProvider } from "@/providers/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "App Marca Pessoal",
  description: "Gerencie sua Marca Pessoal",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex w-full bg-white ">
            {/* Container principal rolável */}
            <div className="flex flex-col w-full ml-[64px] pt-[60px] ">
              <div className="w-full h-screen overflow-y-auto ">
                <div className="w-full flex justify-center mx-auto">
                  <div className="w-full md:max-w-6x1">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
