// lib/copytrade.js
// Motor de copy trading. SEM efeitos colaterais na parte de planejamento
// (planCopyOrder é pura e testável). A execução real só ocorre quando
// COPY_LIVE=true e passa por validação + limites de segurança.

import { getCopyConfig, getSecrets, validateConfig } from "./config";
import { fetchActivity, fetchPositionSize } from "./polymarket";
import { loadState, saveState } from "./store";
import { planCopyOrder, planCost, round } from "./copy-plan";

export { planCopyOrder };

/**
 * Executa UM ciclo de polling + cópia.
 * @param opts.now timestamp em segundos (injeção p/ testes)
 * @param opts.placer função async(plan)->result que ENVIA a ordem (injetável p/ testes).
 *                     Se ausente e cfg.live, importa o cliente CLOB real.
 */
export async function runCopyCycle({ now = Math.floor(Date.now() / 1000), placer } = {}) {
  const cfg = getCopyConfig();
  const secrets = getSecrets();
  const v = validateConfig(cfg, secrets);
  if (!v.ok) return { ok: false, errors: v.errors, planned: [], executed: [] };

  const lookback = Number(process.env.COPY_LOOKBACK_SECONDS) || 3600;
  const state = await loadState(secrets.blobToken);
  const seen = new Set(state.seen || []);
  const cursors = { ...(state.cursors || {}) };

  // Resolve o executor real de ordens apenas quando necessário.
  let place = placer;
  if (cfg.live && !place) {
    const { getClob } = await import("./clob");
    const clob = await getClob(secrets);
    place = (plan) => clob.place(plan);
  }

  const planned = [];
  const executed = [];
  let runSpend = 0;

  for (const target of cfg.targets) {
    const start = cursors[target] || now - lookback;
    let acts;
    try {
      acts = await fetchActivity(target, { type: "TRADE", start, limit: 100 });
    } catch (e) {
      planned.push({ target, error: String(e?.message || e) });
      continue;
    }

    let maxTs = cursors[target] || 0;
    for (const act of acts) {
      const ts = Number(act.timestamp) || 0;
      if (ts > maxTs) maxTs = ts;
      const key = `${act.transactionHash || "?"}:${act.asset || "?"}`;
      if (seen.has(key)) continue;

      let ourShares = 0;
      if (String(act.side).toUpperCase() === "SELL" && cfg.live && secrets.funderAddress) {
        try {
          ourShares = await fetchPositionSize(secrets.funderAddress, act.asset);
        } catch {
          ourShares = 0;
        }
      }

      const plan = planCopyOrder(act, cfg, ourShares);
      const record = { target, ...plan };

      if (plan.skip) {
        planned.push(record);
        seen.add(key);
        continue;
      }

      const cost = planCost(plan);
      if (runSpend + cost > cfg.maxUsdPerRun) {
        // Não marca como visto: tenta de novo no próximo ciclo.
        planned.push({ ...record, skip: true, reason: "limite por ciclo (COPY_MAX_USDC_PER_RUN) atingido" });
        continue;
      }

      if (!cfg.live) {
        planned.push({ ...record, mode: "dry-run" });
        seen.add(key);
        runSpend += cost;
        continue;
      }

      try {
        const result = await place(plan);
        executed.push({ ...record, mode: "live", result });
        seen.add(key);
        runSpend += cost;
      } catch (e) {
        executed.push({ ...record, mode: "live", error: String(e?.message || e) });
        seen.add(key); // evita loop de reenvio em erro persistente
      }
    }
    cursors[target] = maxTs || start;
  }

  const result = { ok: true, live: cfg.live, runSpend: round(runSpend), planned, executed };

  // Guarda um resumo enxuto do último ciclo para o painel /copy.
  const trim = (arr) =>
    arr.slice(-30).map((r) => ({
      target: r.target,
      side: r.side || null,
      skip: r.skip || false,
      reason: r.reason || null,
      mode: r.mode || null,
      amountUsd: r.amountUsd ?? null,
      amountShares: r.amountShares ?? null,
      limitPrice: r.limitPrice ?? null,
      error: r.error || null,
      title: r.meta?.title || null,
      outcome: r.meta?.outcome || null,
      sourceUsd: r.meta?.sourceUsd ?? null,
    }));

  await saveState(secrets.blobToken, {
    cursors,
    seen: Array.from(seen).slice(-2000),
    updatedAt: Date.now(),
    lastRun: { at: Date.now(), live: result.live, runSpend: result.runSpend, planned: trim(planned), executed: trim(executed) },
  });

  return result;
}
