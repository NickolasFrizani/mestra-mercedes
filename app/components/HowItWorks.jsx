"use client";
import { howSteps, copy } from "../../lib/data";
import { useScrollReveal, TRANSITION } from "../../lib/hooks";

export default function HowItWorks() {
  const { V } = useScrollReveal();
  return (
    <section style={{ padding: "6rem 2rem", background: "#080612" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div id="how" data-obs style={{ textAlign: "center", marginBottom: "4rem", ...V("how"), transition: TRANSITION }}>
          <div className="dv" style={{ marginBottom: "1.5rem" }} />
          <h2 className="st" style={{ fontSize: "2.2rem", color: "#f8f3e8", fontWeight: 600 }}>
            {copy.howTitle.split(" ")[0]} <span className="sh">{copy.howTitle.split(" ").slice(1).join(" ")}</span>
          </h2>
        </div>
        <div id="how-s" data-obs className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", ...V("how-s"), transition: TRANSITION + " .1s" }}>
          {howSteps.map(([n, t, d], i) => (
            <div key={n} style={{ textAlign: "center", position: "relative" }}>
              {i < 3 && (
                <div style={{ position: "absolute", top: 32, left: "58%", right: "-8%", height: 1, background: "linear-gradient(90deg,#d4af37,transparent)", pointerEvents: "none" }} />
              )}
              <div className="gw" style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,175,55,.07)", border: "1px solid rgba(212,175,55,.32)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
                <span className="sh" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{n}</span>
              </div>
              <div style={{ color: "#f8f3e8", fontSize: ".97rem", fontWeight: 600, marginBottom: ".5rem" }}>{t}</div>
              <div style={{ color: "rgba(248,243,232,.48)", fontSize: ".8rem", lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
