"use client";
import { services, copy } from "../../lib/data";
import { useScrollReveal, TRANSITION } from "../../lib/hooks";

export default function ServicesSection({ onSelectService }) {
  const { V } = useScrollReveal();
  return (
    <section id="services" style={{ padding: "6rem 2rem", background: "#080612" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div id="svc" data-obs style={{ textAlign: "center", marginBottom: "4rem", ...V("svc"), transition: TRANSITION }}>
          <div className="dv" style={{ marginBottom: "1.5rem" }} />
          <h2 className="st" style={{ fontSize: "2.2rem", color: "#f8f3e8", fontWeight: 600, marginBottom: ".7rem" }}>
            Terapias <span className="sh">Transformadoras</span>
          </h2>
          <p style={{ color: "rgba(248,243,232,.52)", fontSize: ".98rem", fontStyle: "italic" }}>
            {copy.servicesSub}
          </p>
        </div>
        <div id="svc-g" data-obs className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem", ...V("svc-g"), transition: TRANSITION + " .1s" }}>
          {services.map((s) => (
            <div key={s.name} className="gl cd" style={{ padding: "1.8rem", borderRadius: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d4af37,transparent)" }} />
              <div style={{ color: "#d4af37", fontSize: "1.7rem", marginBottom: ".9rem" }}>{s.icon}</div>
              <h3 style={{ color: "#f8f3e8", fontSize: "1.15rem", fontWeight: 600, marginBottom: ".5rem" }}>{s.name}</h3>
              <p style={{ color: "rgba(248,243,232,.55)", fontSize: ".86rem", lineHeight: 1.7, marginBottom: "1.1rem" }}>{s.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.3rem", display: "flex", flexDirection: "column", gap: ".3rem" }}>
                {s.tags.map((t) => (
                  <li key={t} style={{ color: "rgba(248,243,232,.62)", fontSize: ".81rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                    <span style={{ color: "#d4af37" }}>✦</span>
                    {t}
                  </li>
                ))}
              </ul>
              <button
                className="bo"
                style={{ width: "100%", padding: ".68rem", borderRadius: 4, fontSize: ".81rem" }}
                onClick={() => onSelectService(s.name)}
              >
                Agendar {s.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
