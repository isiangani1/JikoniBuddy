import "./tailwind.css";
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
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#4a138a_0%,_#24073d_45%,_#12021f_100%)] text-[#f6f1fb]">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
