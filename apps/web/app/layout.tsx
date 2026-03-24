import "./globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jikoni Buddy",
  description: "Jikoni Buddy themed marketplace for food services"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
