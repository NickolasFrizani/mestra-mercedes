"use client";
import { BRAND } from "../../lib/data";
import { scrollToId } from "../../lib/hooks";

export default function Nav({ onOpenBooking }) {
  const links = [
    ["Serviços", "services"],
    ["Sobre", "about"],
    ["Depoimentos", "testimonials"],
  ];
  return (
    <nav className="gl" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => scrollToId("hero")} style={{ cursor: "pointer" }}>
          <div className="sh" style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: ".07em" }}>
            ✦ {BRAND.name}
          </div>
          <div style={{ color: "rgba(212,175,55,.5)", fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase" }}>
            {BRAND.role}
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          {links.map(([l, id]) => (
            <button key={id} className="nl" onClick={() => scrollToId(id)}>
              {l}
            </button>
          ))}
          <button className="bg" style={{ padding: ".55rem 1.5rem", borderRadius: 4, fontSize: ".83rem" }} onClick={onOpenBooking}>
            Agendar
          </button>
        </div>
      </div>
    </nav>
  );
}
