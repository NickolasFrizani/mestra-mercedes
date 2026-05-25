"use client";
import { BRAND, certifications, copy } from "../../lib/data";
import { useScrollReveal, TRANSITION } from "../../lib/hooks";

export default function AboutSection({ onOpenBooking }) {
  const { V } = useScrollReveal();
  return (
    <section id="about" style={{ padding: "6rem 2rem", background: "linear-gradient(180deg,#0d0920,#080612)" }}>
      <div className="g2" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div id="abt-i" data-obs style={{ position: "relative", ...V("abt-i"), transition: TRANSITION }}>
          <div style={{ position: "absolute", top: -18, left: -18, width: "calc(100% + 36px)", height: "calc(100% + 36px)", border: "1px solid rgba(212,175,55,.07)", borderRadius: 16, pointerEvents: "none" }} />
          <div className="gw" style={{ borderRadius: 12, overflow: "hidden" }}>
            <img src="/photos/photo1.jpg" alt="Mestra Mercedes Miagawa terapeuta energética" style={{ width: "100%", display: "block" }} />
          </div>
          <div className="gl" style={{ position: "absolute", bottom: "2rem", right: "-1.8rem", padding: "1.2rem 1.4rem", borderRadius: 12, maxWidth: 185 }}>
            <div className="sh" style={{ fontSize: "1.7rem", fontWeight: 700 }}>{BRAND.anosExperiencia}</div>
            <div style={{ color: "rgba(248,243,232,.6)", fontSize: ".8rem" }}>{copy.aboutBadge}</div>
          </div>
        </div>
        <div id="abt-t" data-obs style={{ ...V("abt-t"), transition: TRANSITION + " .15s" }}>
          <div className="dv" style={{ margin: "0 0 1.5rem 0" }} />
          <h2 className="st" style={{ fontSize: "2.2rem", color: "#f8f3e8", fontWeight: 600, marginBottom: "1.2rem" }}>
            Conheça a <span className="sh">{BRAND.prefix} {BRAND.name.split(" ")[0]}</span>
          </h2>
          <p style={{ color: "rgba(248,243,232,.7)", fontSize: ".98rem", lineHeight: 1.9, marginBottom: "1.1rem", fontStyle: "italic" }}>
            {BRAND.bio}
          </p>
          <p style={{ color: "rgba(248,243,232,.55)", fontSize: ".9rem", lineHeight: 1.9, marginBottom: "1.8rem" }}>
            {BRAND.bioExtra}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem", marginBottom: "1.8rem" }}>
            {certifications.map((c) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: ".45rem" }}>
                <span style={{ color: "#d4af37", fontSize: ".85rem" }}>◈</span>
                <span style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem" }}>{c}</span>
              </div>
            ))}
          </div>
          <button className="bg" style={{ padding: "1rem 2.5rem", borderRadius: 4, fontSize: ".93rem" }} onClick={onOpenBooking}>
            ✦ Agendar com {BRAND.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </section>
  );
}
