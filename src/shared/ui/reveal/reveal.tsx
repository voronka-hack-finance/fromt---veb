"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import styles from "./reveal.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animate on mount instead of waiting for scroll into view. */
  immediate?: boolean;
};

export function Reveal({ children, className, delay = 0, immediate = false }: RevealProps) {
  return (
    <motion.div
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0, scale: 1 } }
        : {
            whileInView: { opacity: 1, y: 0, scale: 1 },
            viewport: { once: true, amount: 0.1, margin: "0px 0px -40px 0px" },
          })}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

