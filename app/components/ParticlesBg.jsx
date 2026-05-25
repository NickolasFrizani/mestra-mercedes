"use client";
import { useParticles } from "../../lib/hooks";

export default function ParticlesBg() {
  const particles = useParticles(35);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="pt"
          style={{
            left: `${p.x}%`,
            bottom: "-4px",
            width: p.size + "px",
            height: p.size + "px",
            animationDelay: p.delay + "s",
            animationDuration: p.dur + "s",
            opacity: p.op,
            boxShadow: `0 0 ${p.size * 2}px rgba(212,175,55,.65)`,
          }}
        />
      ))}
    </div>
  );
}
