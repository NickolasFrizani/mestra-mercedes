"use client";
import { testimonials, copy } from "../../lib/data";
import { useScrollReveal, TRANSITION } from "../../lib/hooks";

export default function TestimonialsSection() {
  const { V } = useScrollReveal();
  return (
    <section id="testimonials" style={{ padding: "6rem 2rem", background: "linear-gradient(180deg,#0d0920,#080612)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div id="test" data-obs style={{ textAlign: "center", marginBottom: "4rem", ...V("test"), transition: TRANSITION }}>
          <div className="dv" style={{ marginBottom: "1.5rem" }} />
          <h2 className="st" style={{ fontSize: "2.2rem", color: "#f8f3e8", fontWeight: 600 }}>
            Vidas <span className="sh">Transformadas</span>
          </h2>
        </div>
        <div id="test-g" data-obs className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.4rem", ...V("test-g"), transition: TRANSITION + " .1s" }}>
          {testimonials.map((t, i) => (
            <div key={i} className="gl cd" style={{ padding: "1.8rem", borderRadius: 12 }}>
              <div style={{ color: "#d4af37", fontSize: "1.05rem", letterSpacing: 2, marginBottom: ".9rem" }}>★★★★★</div>
              <p style={{ color: "rgba(248,243,232,.75)", fontSize: ".9rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.3rem" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#d4af37,#8b6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a1208", fontWeight: 700, fontSize: "1.05rem", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ color: "#f8f3e8", fontWeight: 600, fontSize: ".86rem" }}>{t.name}</div>
                  <div style={{ color: "rgba(248,243,232,.42)", fontSize: ".76rem" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
