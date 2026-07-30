import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RL LeagueOS | Rocket League League Management",
  description:
    "The modern platform for managing Rocket League leagues, teams, players, schedules, and stats.",
  icons: {
    icon: "/logo-rl-os.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} antialiased`}>{children}</body>
    </html>
  );
}
