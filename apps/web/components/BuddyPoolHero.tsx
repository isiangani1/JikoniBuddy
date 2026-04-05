"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buddies } from "@/data/buddies";

const MotionDiv = motion.div as any;
const MotionLine = motion.line as any;

export default function BuddyPoolHero() {
  const [selectedBuddyId, setSelectedBuddyId] = useState<string | null>(null);

  const radius = 140; // Orbit radius
  const innerRadius = 55; // Paired distance from center

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Radar Rings */}
      <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5" />
      <div className="absolute w-[200px] h-[200px] rounded-full border border-white/10" />
      <div className="absolute w-[100px] h-[100px] rounded-full border border-purple-500/10" />
      
      {/* Central Node: Seller */}
      <MotionDiv 
        layout
        className="z-30 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-[0_0_30px_rgba(124,58,237,0.4)] border border-white/20 select-none cursor-default"
        animate={{ scale: selectedBuddyId ? 1.1 : 1 }}
      >
        <span className="text-[10px] uppercase tracking-tighter">Seller</span>
      </MotionDiv>

      {/* Orbiting Buddies */}
      <AnimatePresence>
        {buddies.slice(0, 6).map((buddy, index) => {
          const isSelected = selectedBuddyId === buddy.id;
          const angles = [0, 60, 120, 180, 240, 300];
          const angle = angles[index % angles.length];
          
          const orbitX = Math.cos((angle * Math.PI) / 180) * radius;
          const orbitY = Math.sin((angle * Math.PI) / 180) * radius;

          const pairX = Math.cos((angle * Math.PI) / 180) * innerRadius;
          const pairY = Math.sin((angle * Math.PI) / 180) * innerRadius;

          return (
            <MotionDiv
              key={buddy.id}
              initial={false}
              animate={{
                x: isSelected ? pairX : orbitX,
                y: isSelected ? pairY : orbitY,
                scale: isSelected ? 1.2 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 12
              }}
              onClick={() => setSelectedBuddyId(isSelected ? null : buddy.id)}
              className={`absolute z-40 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white cursor-pointer border backdrop-blur-md transition-shadow hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] ${isSelected ? 'border-purple-400 shadow-2xl z-50 ring-2 ring-purple-500/20' : 'border-white/10'}`}
              style={{
                background: `linear-gradient(135deg, rgba(88, 28, 135, 0.4), rgba(30, 10, 60, 0.4))`
              }}
              title={buddy.name}
            >
              <span className="text-xs font-black">{buddy.initials}</span>
              {isSelected && (
                <MotionDiv 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <a 
                    href={`/buddy/${buddy.id}`}
                    className="px-2 py-1 rounded bg-purple-500 text-[8px] font-bold uppercase hover:bg-purple-400 transition-colors"
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

      {/* Connection Lines (Visible only when paired) */}
      {selectedBuddyId && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          <MotionLine
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            x1="50%"
            y1="50%"
          />
        </svg>
      )}
    </div>
  );
}
