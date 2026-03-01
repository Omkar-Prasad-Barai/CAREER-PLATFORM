import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export interface HighlighterProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  action?: "highlight" | "underline";
}

export const Highlighter: React.FC<HighlighterProps> = ({
  children,
  className,
  color = "rgba(250, 204, 21, 0.4)",
  action = "highlight",
}) => {
  return (
    <span className={cn("relative inline-block z-10", className)}>
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "104%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className={cn(
          "absolute left-[-2%] z-[-1] rounded-sm",
          action === "highlight" ? "bottom-[5%] h-[80%]" : "bottom-[5%] h-[35%]"
        )}
        style={{
          backgroundColor: color,
          transform: "skewX(-12deg) rotate(-1deg)",
        }}
      />
      {children}
    </span>
  );
};
