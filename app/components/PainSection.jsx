"use client";
import { painPoints, copy } from "../../lib/data";
import { useScrollReveal, TRANSITION } from "../../lib/hooks";

export default function PainSection({ onOpenBooking }) {
  const { V } = useScrollReveal();
  return (
    <section style={{ padding: "5rem 2rem", background: "linear-gradient(180deg,#080612,#0d0920)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div id="pain" data-obs style={{ textAlign: "center", marginBottom: "3.5rem", ...V("pain"), transition: TRANSITION }}>
          <div className="dv" style={{ marginBottom: "1.5rem" }} />
          <h2 className="st" style={{ fontSize: "2.2rem", color: "#f8f3e8", fontWeight: 600 }}>
            Você se identifica com <span className="sh">alguma dessas situações?</span>
          </h2>
        </div>
        <div id="pain-g" data-obs className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.4rem", ...V("pain-g"), transition: TRANSITION + " .12s" }}>
          {painPoints.map(([ic, t, d]) => (
            <div key={t} className="gl cd" style={{ padding: "1.8rem", borderRadius: 12, display: "flex", gap: "1.3rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.9rem", flexShrink: 0 }}>{ic}</span>
              <div>
                <div style={{ color: "#f8f3e8", fontSize: "1.03rem", fontWeight: 600, marginBottom: ".4rem" }}>{t}</div>
                <div style={{ color: "rgba(248,243,232,.55)", fontSize: ".86rem", lineHeight: 1.7 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p style={{ color: "rgba(248,243,232,.62)", fontSize: "1rem", fontStyle: "italic", marginBottom: "1.4rem" }}>
            {copy.painCta}
          </p>
          <button className="bg" style={{ padding: "1rem 3rem", borderRadius: 4, fontSize: "1rem" }} onClick={onOpenBooking}>
            Quero me transformar agora ✦
          </button>
        </div>
      </div>
    </section>
  );
}
