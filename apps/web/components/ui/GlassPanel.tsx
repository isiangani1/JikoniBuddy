"use client";

import type { HTMLAttributes } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement>;

export function GlassPanel({ className, ...props }: GlassPanelProps) {
  const classes = [
    "rounded-2xl",
    "bg-white/5",
    "border",
    "border-white/10",
    "backdrop-blur-md",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
