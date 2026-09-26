import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym OS — The Operating System for Indian Gyms",
  description:
    "Members, payments, leads, QR check-ins and WhatsApp automation in one platform. A product of Beyond Pixells.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
