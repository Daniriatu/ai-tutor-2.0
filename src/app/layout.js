import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "AI TUTOR",
    description: "An ai tutor helps you write better.",
    icons: {
        icon: "/favicon.ico", // 显式指定使用这个文件
    },
};

// export default function RootLayout({ children }) {
//     return (
//         <html lang="en">
//             <body
//                 className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//             >
//                 {children}
//             </body>
//         </html>
//     );
// }

export default function RootLayout({ children }) {
    return (
        <html lang="zh">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
