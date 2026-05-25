"use client";
import { useState, useEffect } from "react";

/** Particles flutuantes para o background */
export function useParticles(count = 35) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        dur: Math.random() * 12 + 8,
        op: Math.random() * 0.5 + 0.15,
      }))
    );
  }, [count]);
  return particles;
}

/** Detecta entrada na viewport via IntersectionObserver */
export function useScrollReveal(threshold = 0.12) {
  const [visible, setVisible] = useState({});
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => ({ ...v, [e.target.id]: true }));
          }
        });
      },
      { threshold }
    );
    document.querySelectorAll("[data-obs]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [threshold]);

  const V = (id) =>
    visible[id]
      ? { opacity: 1, transform: "translateY(0)" }
      : { opacity: 0, transform: "translateY(40px)" };
  return { V, visible };
}

/** Scroll suave para um id */
export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export const TRANSITION = "all .7s ease";
