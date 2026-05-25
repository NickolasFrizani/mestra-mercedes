"use client";
import { WHATSAPP_URL, copy } from "../../lib/data";

export default function CtaSection({ onOpenBooking }) {
  const openWA = () => window.open(WHATSAPP_URL, "_blank");
  return (
    <section style={{ padding: "6rem 2rem", background: "#080612", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(212,175,55,.045) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
        <div className="dv" style={{ marginBottom: "2rem" }} />
        <h2 style={{ fontSize: "2.5rem", color: "#f8f3e8", fontWeight: 700, marginBottom: "1.4rem", lineHeight: 1.3 }}>
          Sua jornada de <span className="sh">transformação</span> começa agora
        </h2>
        <p style={{ color: "rgba(248,243,232,.58)", fontSize: ".98rem", fontStyle: "italic", marginBottom: "3rem", lineHeight: 1.9 }}>
          {copy.ctaSub}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="bg" style={{ padding: "1.1rem 2.8rem", borderRadius: 4, fontSize: "1rem" }} onClick={onOpenBooking}>
            ✦ Agendar minha transformação
          </button>
          <button className="bo" style={{ padding: "1.1rem 2.3rem", borderRadius: 4, fontSize: ".95rem" }} onClick={openWA}>
            WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
