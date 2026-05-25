"use client";
import { BRAND, EMAIL, copy } from "../../lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="gl" style={{ padding: "2.5rem 2rem", textAlign: "center", borderTop: "1px solid rgba(212,175,55,.1)" }}>
      <div className="sh" style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: ".45rem" }}>
        ✦ {BRAND.prefix} {BRAND.name}
      </div>
      <div style={{ color: "rgba(248,243,232,.35)", fontSize: ".76rem", letterSpacing: ".07em" }}>
        {EMAIL} · {copy.footerTag}
      </div>
      <div style={{ marginTop: ".65rem", color: "rgba(248,243,232,.22)", fontSize: ".7rem" }}>
        © {year} {BRAND.prefix} {BRAND.name} · Todos os direitos reservados
      </div>
    </footer>
  );
}
