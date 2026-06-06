// lib/notify.js
// Alertas via Evolution API (WhatsApp). Best-effort: nunca lança — uma falha
// de notificação não pode derrubar o ciclo de trading.

export async function sendWhatsApp(text) {
  const url = (process.env.EVOLUTION_API_URL || "").replace(/\/$/, "");
  const key = process.env.EVOLUTION_API_KEY || "";
  const instance = process.env.EVOLUTION_INSTANCE || "";
  const to = process.env.EVOLUTION_ALERT_TO || "";
  if (!url || !key || !instance || !to) {
    return { sent: false, reason: "Evolution API não configurada (URL/KEY/INSTANCE/ALERT_TO)" };
  }
  try {
    const res = await fetch(`${url}/message/sendText/${instance}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify({ number: to, text }),
    });
    return { sent: res.ok, status: res.status };
  } catch (e) {
    return { sent: false, reason: String(e?.message || e) };
  }
}

/** Monta um resumo curto do ciclo para o WhatsApp. */
export function summarize(result) {
  if (!result?.ok) return `⚠️ Copy trade não rodou: ${(result?.errors || []).join("; ")}`;
  const exec = result.executed || [];
  const ok = exec.filter((e) => !e.error);
  const fail = exec.filter((e) => e.error);
  const dry = (result.planned || []).filter((p) => p.mode === "dry-run");
  if (result.live) {
    if (exec.length === 0) return null; // nada a relatar
    const lines = ok.map((e) => `✅ ${e.side} ${e.meta?.outcome} — ${e.meta?.title?.slice(0, 40)}`);
    if (fail.length) lines.push(`❌ ${fail.length} falha(s)`);
    return `🤖 Copy trade (LIVE) — gasto ~$${result.runSpend}\n${lines.join("\n")}`;
  }
  if (dry.length === 0) return null;
  const lines = dry.slice(0, 6).map((e) => `• ${e.side} ${e.meta?.outcome} — ${e.meta?.title?.slice(0, 40)}`);
  return `🧪 Copy trade (SIMULAÇÃO) — ${dry.length} ordem(ns) que SERIAM enviadas:\n${lines.join("\n")}`;
}
