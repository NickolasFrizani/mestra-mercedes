"use client";
import { BRAND, WHATSAPP_URL, copy } from "../../lib/data";

export default function Hero({ onOpenBooking }) {
  const openWA = () => window.open(WHATSAPP_URL, "_blank");
  const stats = [
    [BRAND.vidasTransformadas, "Vidas Transformadas"],
    [BRAND.anosExperiencia, "Anos de Experiência"],
    [BRAND.numEspecialidades, "Especialidades"],
  ];
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "6rem 2rem 4rem", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.04, overflow: "hidden", pointerEvents: "none" }}>
        <div className="sp" style={{ width: 800, height: 800, border: "1px solid #d4af37", borderRadius: "50%", position: "absolute" }} />
        <div className="sr" style={{ width: 580, height: 580, border: "1px solid #d4af37", position: "absolute", transform: "rotate(45deg)" }} />
        <div className="sp" style={{ width: 380, height: 380, border: "1px solid #d4af37", borderRadius: "50%", position: "absolute" }} />
      </div>
      <div className="pe" style={{ position: "absolute", top: "12%", left: "4%", width: 480, height: 480, background: "radial-gradient(circle,rgba(212,175,55,.055) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className="pe" style={{ position: "absolute", bottom: "12%", right: "4%", width: 340, height: 340, background: "radial-gradient(circle,rgba(130,80,200,.045) 0%,transparent 70%)", borderRadius: "50%", animationDelay: "2.5s", pointerEvents: "none" }} />

      <div className="g2" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div style={{ animation: "fadeUp 1s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "rgba(212,175,55,.07)", border: "1px solid rgba(212,175,55,.22)", borderRadius: 100, padding: ".4rem 1.1rem", marginBottom: "1.5rem" }}>
            <span style={{ color: "#d4af37", fontSize: ".75rem" }}>✦</span>
            <span style={{ color: "#d4af37", fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase" }}>
              {copy.heroBadge}
            </span>
          </div>
          <h1 className="ht" style={{ fontSize: "2.9rem", fontWeight: 700, lineHeight: 1.2, color: "#f8f3e8", marginBottom: "1.5rem" }}>
            Libere seus <span className="sh">bloqueios energéticos</span> e transforme sua vida
          </h1>
          <p style={{ color: "rgba(248,243,232,.65)", fontSize: "1.03rem", lineHeight: 1.9, marginBottom: "2.5rem", fontWeight: 300, fontStyle: "italic" }}>
            {copy.heroSub}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="bg" style={{ padding: "1rem 2.5rem", borderRadius: 4, fontSize: "1rem" }} onClick={onOpenBooking}>
              ✦ Agendar Consulta
            </button>
            <button className="bo" style={{ padding: "1rem 2rem", borderRadius: 4, fontSize: ".93rem" }} onClick={openWA}>
              WhatsApp
            </button>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(212,175,55,.1)" }}>
            {stats.map(([n, l]) => (
              <div key={l}>
                <div className="sh" style={{ fontSize: "1.65rem", fontWeight: 700 }}>{n}</div>
                <div style={{ color: "rgba(248,243,232,.42)", fontSize: ".76rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hi" style={{ display: "flex", justifyContent: "center", position: "relative", animation: "fadeUp 1s ease .3s both" }}>
          <div style={{ position: "relative", width: 320 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="rg" style={{ width: 250 + i * 65 + "px", height: 250 + i * 65 + "px", top: -(i * 32) + "px", left: -(i * 32) + "px", animationDelay: i * 0.9 + "s" }} />
            ))}
            <div className="gw" style={{ borderRadius: 12, overflow: "hidden", position: "relative", zIndex: 1 }}>
              <img src="/photos/photo2.jpg" alt="Mestra Mercedes com cartas de tarô e radiestesia" style={{ width: "100%", display: "block", filter: "brightness(1.03)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(8,6,18,.88))", padding: "1.8rem 1.4rem 1.3rem" }}>
                <div style={{ color: "#d4af37", fontSize: "1rem", fontWeight: 600 }}>{BRAND.prefix} {BRAND.name}</div>
                <div style={{ color: "rgba(248,243,232,.6)", fontSize: ".79rem" }}>{BRAND.fullTitle}</div>
              </div>
            </div>
            <div className="gl" style={{ position: "absolute", top: "1.5rem", right: "-1rem", padding: ".75rem 1rem", borderRadius: 8, textAlign: "center", zIndex: 2, animation: "fadeUp 1s ease .8s both" }}>
              <div style={{ color: "#d4af37", fontSize: "1.2rem" }}>★★★★★</div>
              <div style={{ color: "rgba(248,243,232,.65)", fontSize: ".7rem" }}>+500 avaliações</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
