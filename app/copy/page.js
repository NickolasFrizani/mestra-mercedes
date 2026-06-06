"use client";
import { useEffect, useState, useCallback } from "react";

const GOLD = "#d4af37";
const BG = "#080612";
const TXT = "#f8f3e8";
const MUTED = "rgba(248,243,232,.55)";
const GREEN = "#4ade80";
const RED = "#f87171";

const fmtUsd = (v) =>
  v == null ? "—" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "USD" });
const fmtDate = (ts) => (ts ? new Date(ts > 1e12 ? ts : ts * 1000).toLocaleString("pt-BR") : "—");

function Card({ children, style }) {
  return (
    <div className="gl cd" style={{ padding: "1.3rem", borderRadius: 12, position: "relative", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
      {children}
    </div>
  );
}

function Dot({ ok }) {
  return <span style={{ color: ok ? GREEN : RED, marginRight: 6 }}>{ok ? "✓" : "✗"}</span>;
}

export default function CopyDashboard() {
  const [secret, setSecret] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(true);

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/copy/status", { headers: { Authorization: `Bearer ${secret}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao carregar.");
      setData(json);
    } catch (e) {
      setError(String(e.message || e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    if (!auto || !data) return;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [auto, data, load]);

  const cfg = data?.config;
  const val = data?.validation;
  const cred = data?.credentials;
  const last = data?.lastRun;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TXT, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Painel <span className="sh">Copy Trading</span>
          </h1>
          <p style={{ color: MUTED, fontSize: ".9rem" }}>
            Status do bot (somente leitura). Informe o <code>CRON_SECRET</code> para acessar.
          </p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); load(); }} style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="CRON_SECRET"
            style={{ flex: "1 1 280px", padding: ".8rem 1rem", borderRadius: 8, border: "1px solid rgba(212,175,55,.3)", background: "rgba(255,255,255,.04)", color: TXT, fontFamily: "var(--font-geist-mono), monospace" }}
          />
          <button type="submit" className="bo" disabled={loading} style={{ padding: ".8rem 1.6rem", borderRadius: 8, minWidth: 120, opacity: loading ? 0.6 : 1 }}>
            {loading ? "…" : "Carregar"}
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", color: MUTED, fontSize: ".82rem" }}>
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> auto 30s
          </label>
        </form>

        {error && (
          <Card style={{ borderColor: RED, marginBottom: "1.5rem" }}>
            <span style={{ color: RED }}>⚠ {error}</span>
          </Card>
        )}

        {data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Estado */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ padding: ".3rem .8rem", borderRadius: 999, fontWeight: 700, fontSize: ".8rem", background: cfg.live ? "rgba(248,113,113,.15)" : "rgba(74,222,128,.15)", color: cfg.live ? RED : GREEN, border: `1px solid ${cfg.live ? RED : GREEN}` }}>
                  {cfg.live ? "● AO VIVO (ordens reais)" : "● SIMULAÇÃO"}
                </span>
                <span style={{ color: MUTED, fontSize: ".85rem" }}>Modo: <b style={{ color: TXT }}>{cfg.sizeMode}</b>{cfg.sizeMode === "mirror" ? " (cópia fiel 1:1)" : ""}</span>
                <span style={{ marginLeft: "auto", color: MUTED, fontSize: ".8rem" }}>
                  {val?.ok ? <span style={{ color: GREEN }}>✓ config válida</span> : <span style={{ color: RED }}>✗ config inválida</span>}
                </span>
              </div>
              {!val?.ok && (
                <ul style={{ margin: ".8rem 0 0", paddingLeft: "1.1rem", color: RED, fontSize: ".82rem" }}>
                  {val.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </Card>

            {/* Config + credenciais */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
              <Card>
                <h3 style={{ fontSize: ".95rem", marginBottom: ".7rem" }}>Parâmetros</h3>
                <div style={{ fontSize: ".82rem", color: MUTED, lineHeight: 1.9 }}>
                  <div>Teto por ordem: <b style={{ color: TXT }}>{fmtUsd(cfg.maxUsdPerTrade)}</b></div>
                  <div>Teto por ciclo: <b style={{ color: TXT }}>{fmtUsd(cfg.maxUsdPerRun)}</b></div>
                  <div>Piso origem: <b style={{ color: TXT }}>{cfg.minSourceUsd === 0 ? "copia tudo" : fmtUsd(cfg.minSourceUsd)}</b></div>
                  <div>Slippage máx.: <b style={{ color: TXT }}>{(cfg.slippageBps / 100).toFixed(2)}%</b></div>
                </div>
              </Card>
              <Card>
                <h3 style={{ fontSize: ".95rem", marginBottom: ".7rem" }}>Credenciais</h3>
                <div style={{ fontSize: ".82rem", lineHeight: 1.9 }}>
                  <div><Dot ok={cred.apiKey} />API key</div>
                  <div><Dot ok={cred.secret && cred.passphrase} />secret + passphrase</div>
                  <div><Dot ok={cred.mnemonic} />carteira (mnemônico)</div>
                  <div><Dot ok={!!cred.funderAddress} />funder address</div>
                  <div><Dot ok={cred.blobConfigured} />Vercel Blob</div>
                </div>
              </Card>
            </div>

            {/* Alvos */}
            <Card>
              <h3 style={{ fontSize: ".95rem", marginBottom: ".7rem" }}>Carteiras-alvo ({cfg.targets.length})</h3>
              {cfg.targets.map((t) => (
                <div key={t} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: ".8rem", fontFamily: "var(--font-geist-mono), monospace", marginBottom: ".35rem" }}>
                  <a href={`https://polymarket.com/profile/${t}`} target="_blank" rel="noreferrer" style={{ color: GOLD, wordBreak: "break-all" }}>{t}</a>
                  <span style={{ color: MUTED, whiteSpace: "nowrap" }}>último: {fmtDate(data.cursors?.[t])}</span>
                </div>
              ))}
            </Card>

            {/* Último ciclo */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" }}>
                <h3 style={{ fontSize: ".95rem" }}>Último ciclo</h3>
                <span style={{ color: MUTED, fontSize: ".78rem" }}>{last ? `${fmtDate(last.at)} · gasto ~${fmtUsd(last.runSpend)}` : "ainda não rodou"}</span>
              </div>
              {!last && <p style={{ color: MUTED, fontSize: ".82rem" }}>Aguardando o primeiro ciclo do agendador.</p>}
              {last && (
                <RunTables planned={last.planned || []} executed={last.executed || []} />
              )}
            </Card>

            <p style={{ color: MUTED, fontSize: ".72rem", textAlign: "center" }}>
              Painel read-only · {fmtDate(Date.now())} · seen: {data.seenCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RunTables({ planned, executed }) {
  const exec = executed.filter((e) => !e.error);
  const fail = executed.filter((e) => e.error);
  const sims = planned.filter((p) => !p.skip);
  const skips = planned.filter((p) => p.skip);
  const Row = ({ r, color }) => (
    <tr style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <td style={{ padding: ".4rem .5rem", color, fontWeight: 600 }}>{r.side === "BUY" ? "Compra" : r.side === "SELL" ? "Venda" : "—"}</td>
      <td style={{ padding: ".4rem .5rem", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title || "—"} <span style={{ color: MUTED }}>({r.outcome || "—"})</span></td>
      <td style={{ padding: ".4rem .5rem", textAlign: "right", whiteSpace: "nowrap" }}>{r.amountUsd != null ? fmtUsd(r.amountUsd) : r.amountShares != null ? `${r.amountShares} sh` : "—"}</td>
    </tr>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
      <div>
        <div style={{ color: MUTED, fontSize: ".78rem", marginBottom: ".3rem" }}>
          {exec.length > 0 ? `Executadas (${exec.length})` : `Planejadas / simuladas (${sims.length})`}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".78rem" }}>
          <tbody>
            {(exec.length > 0 ? exec : sims).slice(0, 12).map((r, i) => (
              <Row key={i} r={r} color={r.side === "BUY" ? GREEN : RED} />
            ))}
            {(exec.length === 0 && sims.length === 0) && (
              <tr><td style={{ padding: ".4rem .5rem", color: MUTED }}>nenhuma</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <div style={{ color: MUTED, fontSize: ".78rem", marginBottom: ".3rem" }}>Ignoradas ({skips.length}){fail.length ? ` · falhas ${fail.length}` : ""}</div>
        <div style={{ fontSize: ".76rem", color: MUTED, maxHeight: 200, overflowY: "auto" }}>
          {skips.slice(0, 12).map((s, i) => (
            <div key={i} style={{ padding: ".2rem 0", borderTop: "1px solid rgba(255,255,255,.04)" }}>
              {(s.title || "—").slice(0, 36)} — {s.reason}
            </div>
          ))}
          {fail.slice(0, 6).map((f, i) => (
            <div key={`f${i}`} style={{ padding: ".2rem 0", color: RED }}>✗ {(f.title || "—").slice(0, 30)} — {String(f.error).slice(0, 50)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
