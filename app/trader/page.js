"use client";
import { useState } from "react";

const GOLD = "#d4af37";
const BG = "#080612";
const TXT = "#f8f3e8";
const MUTED = "rgba(248,243,232,.55)";

const fmtUsd = (v) =>
  Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const fmtPct = (v) =>
  `${(Number(v) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

const fmtDate = (ts) =>
  ts ? new Date(ts * 1000).toLocaleDateString("pt-BR") : "—";

const pnlColor = (v) => (v > 0 ? "#4ade80" : v < 0 ? "#f87171" : MUTED);

function Card({ children, style }) {
  return (
    <div
      className="gl cd"
      style={{ padding: "1.4rem", borderRadius: 12, position: "relative", overflow: "hidden", ...style }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <Card>
      <div style={{ color: MUTED, fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
        {label}
      </div>
      <div style={{ color: color || TXT, fontSize: "1.5rem", fontWeight: 700 }}>{value}</div>
    </Card>
  );
}

export default function TraderPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function analyze(e) {
    e?.preventDefault();
    setError("");
    setData(null);
    const addr = address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setError("Endereço inválido. Cole uma carteira no formato 0x + 40 caracteres hexadecimais.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/trader?address=${addr}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao analisar.");
      setData(json);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  const t = data?.trades;
  const p = data?.positions;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TXT, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: ".5rem" }}>
            Análise de <span className="sh">Trader</span>
          </h1>
          <p style={{ color: MUTED, fontSize: ".95rem" }}>
            Cole o endereço de uma carteira da Polymarket e veja seus padrões de trading,
            PnL e mercados favoritos. Somente leitura — nenhuma ordem é enviada.
          </p>
        </header>

        <form onSubmit={analyze} style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x0000000000000000000000000000000000000000"
            spellCheck={false}
            style={{
              flex: "1 1 320px",
              padding: ".8rem 1rem",
              borderRadius: 8,
              border: "1px solid rgba(212,175,55,.3)",
              background: "rgba(255,255,255,.04)",
              color: TXT,
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: ".9rem",
            }}
          />
          <button
            type="submit"
            className="bo"
            disabled={loading}
            style={{ padding: ".8rem 1.6rem", borderRadius: 8, fontSize: ".9rem", minWidth: 130, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Analisando…" : "Analisar"}
          </button>
        </form>

        {error && (
          <Card style={{ borderColor: "#f87171", marginBottom: "1.5rem" }}>
            <div style={{ color: "#f87171", fontSize: ".9rem" }}>⚠ {error}</div>
          </Card>
        )}

        {data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Perfil */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                {data.profile?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.profile.image} alt="" width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover" }} />
                )}
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {data.profile?.name || data.profile?.pseudonym || "Trader anônimo"}
                  </div>
                  <div style={{ color: MUTED, fontFamily: "var(--font-geist-mono), monospace", fontSize: ".78rem", wordBreak: "break-all" }}>
                    {data.address}
                  </div>
                </div>
                <a
                  href={`https://polymarket.com/profile/${data.address}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: "auto", color: GOLD, fontSize: ".82rem", textDecoration: "underline" }}
                >
                  Ver na Polymarket ↗
                </a>
              </div>
            </Card>

            {/* Cartões principais */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem" }}>
              <Stat label="Valor do portfólio" value={fmtUsd(data.portfolioValue)} />
              <Stat label="PnL em aberto" value={fmtUsd(p.cashPnl)} color={pnlColor(p.cashPnl)} />
              <Stat label="PnL realizado" value={fmtUsd(p.realizedPnl)} color={pnlColor(p.realizedPnl)} />
              <Stat label="Win rate" value={fmtPct(p.winRate)} color={GOLD} />
              <Stat label="Trades (amostra)" value={t.totalTrades.toLocaleString("pt-BR")} />
              <Stat label="Volume negociado" value={fmtUsd(t.volumeUsd)} />
              <Stat label="Mercados distintos" value={t.uniqueMarkets.toLocaleString("pt-BR")} />
              <Stat label="Ticket médio" value={fmtUsd(t.avgTradeUsd)} />
            </div>

            {/* Compra vs Venda + período */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
              <Card>
                <div style={{ color: MUTED, fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".6rem" }}>
                  Compras vs Vendas
                </div>
                <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: ".5rem", background: "rgba(255,255,255,.06)" }}>
                  <div style={{ width: `${(t.buys / Math.max(t.totalTrades, 1)) * 100}%`, background: "#4ade80" }} />
                  <div style={{ width: `${(t.sells / Math.max(t.totalTrades, 1)) * 100}%`, background: "#f87171" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem" }}>
                  <span style={{ color: "#4ade80" }}>{t.buys} compras</span>
                  <span style={{ color: "#f87171" }}>{t.sells} vendas</span>
                </div>
              </Card>
              <Card>
                <div style={{ color: MUTED, fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".6rem" }}>
                  Período de atividade (amostra)
                </div>
                <div style={{ fontSize: ".95rem" }}>
                  {fmtDate(t.firstTs)} &nbsp;→&nbsp; {fmtDate(t.lastTs)}
                </div>
              </Card>
            </div>

            {/* Top mercados */}
            {t.topMarkets.length > 0 && (
              <Card>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Mercados mais negociados</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                  {t.topMarkets.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: ".5rem" }}>
                      <span style={{ color: TXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
                      <span style={{ color: MUTED, whiteSpace: "nowrap" }}>{m.trades}× · {fmtUsd(m.volume)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Ganhos e perdas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
              {p.topWinners.length > 0 && (
                <Card>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".8rem", color: "#4ade80" }}>Maiores ganhos</h3>
                  {p.topWinners.map((w, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: ".6rem", fontSize: ".82rem", marginBottom: ".45rem" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title} <span style={{ color: MUTED }}>({w.outcome})</span></span>
                      <span style={{ color: "#4ade80", whiteSpace: "nowrap" }}>{fmtUsd(w.cashPnl)}</span>
                    </div>
                  ))}
                </Card>
              )}
              {p.topLosers.length > 0 && (
                <Card>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".8rem", color: "#f87171" }}>Maiores perdas</h3>
                  {p.topLosers.map((w, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: ".6rem", fontSize: ".82rem", marginBottom: ".45rem" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title} <span style={{ color: MUTED }}>({w.outcome})</span></span>
                      <span style={{ color: "#f87171", whiteSpace: "nowrap" }}>{fmtUsd(w.cashPnl)}</span>
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Trades recentes */}
            {t.recent.length > 0 && (
              <Card>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Trades recentes</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
                    <thead>
                      <tr style={{ color: MUTED, textAlign: "left" }}>
                        <th style={{ padding: ".4rem .5rem" }}>Data</th>
                        <th style={{ padding: ".4rem .5rem" }}>Lado</th>
                        <th style={{ padding: ".4rem .5rem" }}>Mercado</th>
                        <th style={{ padding: ".4rem .5rem" }}>Resultado</th>
                        <th style={{ padding: ".4rem .5rem", textAlign: "right" }}>Preço</th>
                        <th style={{ padding: ".4rem .5rem", textAlign: "right" }}>USD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.recent.map((r, i) => (
                        <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
                          <td style={{ padding: ".45rem .5rem", color: MUTED, whiteSpace: "nowrap" }}>{fmtDate(r.timestamp)}</td>
                          <td style={{ padding: ".45rem .5rem", color: r.side === "BUY" ? "#4ade80" : "#f87171", fontWeight: 600 }}>{r.side === "BUY" ? "Compra" : "Venda"}</td>
                          <td style={{ padding: ".45rem .5rem", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</td>
                          <td style={{ padding: ".45rem .5rem", color: MUTED }}>{r.outcome}</td>
                          <td style={{ padding: ".45rem .5rem", textAlign: "right" }}>{(r.price * 100).toFixed(1)}¢</td>
                          <td style={{ padding: ".45rem .5rem", textAlign: "right" }}>{fmtUsd(r.usd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <p style={{ color: MUTED, fontSize: ".72rem", textAlign: "center" }}>
              Dados de <a href="https://data-api.polymarket.com" target="_blank" rel="noreferrer" style={{ color: GOLD }}>data-api.polymarket.com</a>.
              Amostra de até 500 trades mais recentes. Para fins educacionais — não é recomendação de investimento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
