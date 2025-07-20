import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";

const balooBhai = Baloo_Bhai_2({
  variable: "--font-baloo-bhai",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // You can customize weights as needed
  display: "swap",
});

export const metadata: Metadata = {
  title: "PSYCAREAI",
  description: "Made by Munim Usmani and Syed Uzair",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${balooBhai.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}