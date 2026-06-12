"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { listPublicHelpers } from "@/lib/buddy-client";

const MotionDiv = motion.div as any;
const MotionLine = motion.line as any;

export default function BuddyPoolHero() {
  const [selectedBuddyId, setSelectedBuddyId] = useState<string | null>(null);
  const [liveBuddies, setLiveBuddies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const buddyCount = liveBuddies.length;
  const ringCount = Math.max(3, Math.ceil(Math.max(buddyCount, 1) / 4) + 1);
  const ringSizes = Array.from({ length: ringCount }, (_, index) => 110 + index * 70);
  const orbitBaseRadius = buddyCount > 8 ? 150 : 135;
  const orbitRadiusStep = 55;
  const innerRadius = 55;

  useEffect(() => {
    let active = true;

    const loadHelpers = async () => {
      const retryDelaysMs = [0, 700, 1500];

      for (const delayMs of retryDelaysMs) {
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        try {
          const items = await listPublicHelpers(18);
          if (!active) return;
          setLiveBuddies(Array.isArray(items) ? items : []);
          setIsLoading(false);
          return;
        } catch {
          if (!active) return;
        }
      }

      if (!active) return;
      setLiveBuddies([]);
      setIsLoading(false);
    };

    void loadHelpers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Radar Rings */}
        {ringSizes.map((size, index) => (
          <div
            key={`ring-${size}`}
            className={`absolute rounded-full ${
              index === 0
                ? "border border-purple-500/10"
                : index % 2 === 0
                  ? "border border-white/5"
                  : "border border-white/10"
            }`}
            style={{
              width: `${size}px`,
              height: `${size}px`
            }}
          />
        ))}

        {/* Central Node: Seller */}
        <MotionDiv
          layout
          className="z-30 flex h-16 w-16 cursor-default items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-600 to-indigo-700 font-black text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] select-none"
          animate={{ scale: selectedBuddyId ? 1.1 : 1 }}
        >
          <span className="text-[10px] uppercase tracking-tighter">Seller</span>
        </MotionDiv>

        {/* Orbiting Buddies */}
        <AnimatePresence>
          {liveBuddies.map((buddy, index) => {
            const isSelected = selectedBuddyId === buddy.id;
            let remaining = index;
            let ringIndex = 0;
            let ringCapacity = 6;

            while (remaining >= ringCapacity) {
              remaining -= ringCapacity;
              ringIndex += 1;
              ringCapacity = 8 + (ringIndex - 1) * 2;
            }

            const itemsInRing = Math.min(
              ringCapacity,
              Math.max(buddyCount - (index - remaining), 1)
            );
            const positionInRing = remaining;
            const safeItemsInRing = Math.max(itemsInRing, 1);
            const angle = (360 / safeItemsInRing) * positionInRing - 90;
            const orbitRadius = orbitBaseRadius + ringIndex * orbitRadiusStep;

            const orbitX = Math.cos((angle * Math.PI) / 180) * orbitRadius;
            const orbitY = Math.sin((angle * Math.PI) / 180) * orbitRadius;

            const pairX = Math.cos((angle * Math.PI) / 180) * innerRadius;
            const pairY = Math.sin((angle * Math.PI) / 180) * innerRadius;

            return (
              <MotionDiv
                key={buddy.id}
                initial={false}
                animate={{
                  x: isSelected ? pairX : orbitX,
                  y: isSelected ? pairY : orbitY,
                  scale: isSelected ? 1.2 : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 12
                }}
                onClick={() => setSelectedBuddyId(isSelected ? null : buddy.id)}
                className={`absolute z-40 flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-xl border text-white backdrop-blur-md transition-shadow hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] ${isSelected ? "z-50 border-purple-400 shadow-2xl ring-2 ring-purple-500/20" : "border-white/10"}`}
                style={{
                  background: "linear-gradient(135deg, rgba(88, 28, 135, 0.4), rgba(30, 10, 60, 0.4))"
                }}
                title={buddy.name}
              >
                <span className="text-xs font-black">{buddy.initials}</span>
                <MotionDiv
                  initial={{ opacity: 0, y: 4 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#120c1c]/95 px-3 py-1 text-[10px] font-bold text-white opacity-0 shadow-[0_16px_35px_rgba(0,0,0,0.35)]"
                >
                  {buddy.name}
                </MotionDiv>
                {isSelected && (
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <a
                      href={`/buddy/${buddy.id}`}
                      className="rounded bg-purple-500 px-2 py-1 text-[8px] font-bold uppercase transition-colors hover:bg-purple-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Profile
                    </a>
                  </MotionDiv>
                )}
              </MotionDiv>
            );
          })}
        </AnimatePresence>

        {!isLoading && liveBuddies.length === 0 ? (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-md">
              <p className="m-0 text-sm font-bold text-white">No live buddies yet</p>
              <p className="m-0 mt-1 text-xs text-white/50">
                Register a buddy to see real helper profiles here.
              </p>
            </div>
          </div>
        ) : null}

        {/* Connection Lines (Visible only when paired) */}
        {selectedBuddyId && (
          <svg className="absolute inset-0 z-20 h-full w-full pointer-events-none">
            <MotionLine
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              x1="50%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="rgba(124, 92, 255, 0.45)"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
