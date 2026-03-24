"use client";

import Link from "next/link";
import { buddies } from "@/data/buddies";

export default function BuddyPoolHero() {
  return (
    <div className="buddy-float orbit">
      <div className="orbit-ring" />
      <div className="orbit-center">Seller</div>
      {buddies.map((buddy, index) => (
        (() => {
          const colors: Array<[string, string]> = [
            ["rgba(138, 75, 219, 0.95)", "rgba(45, 10, 80, 0.95)"],
            ["rgba(176, 106, 255, 0.9)", "rgba(58, 16, 112, 0.9)"],
            ["rgba(115, 68, 200, 0.9)", "rgba(28, 8, 58, 0.9)"],
            ["rgba(152, 94, 232, 0.9)", "rgba(54, 14, 102, 0.9)"],
            ["rgba(122, 72, 200, 0.9)", "rgba(34, 8, 70, 0.9)"],
            ["rgba(165, 112, 240, 0.9)", "rgba(55, 16, 110, 0.9)"]
          ];
          const [from, to] = colors[index % colors.length];
          return (
        <Link
          key={buddy.id}
          href={`/buddy/${buddy.id}`}
          className="floating-avatar orbiting-avatar"
          style={{
            ["--angle" as string]: `${(360 / (buddies.length + 2)) * index}deg`,
            background: `linear-gradient(135deg, ${from}, ${to})`
          }}
          title={buddy.name}
        >
          {buddy.initials}
        </Link>
          );
        })()
      ))}
    </div>
  );
}
