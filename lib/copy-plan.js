// lib/copy-plan.js
// Lógica PURA de dimensionamento de uma ordem copiada. Sem imports, sem
// efeitos colaterais — testável isoladamente. A orquestração fica em copytrade.js.

export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
export const round = (x, d = 2) => {
  const f = 10 ** d;
  return Math.round((Number(x) + Number.EPSILON) * f) / f;
};

/**
 * Plano de ordem para copiar UM trade do alvo.
 * @param act atividade TRADE da Data API: { side, price, size, usdcSize, asset, outcome, title, transactionHash }
 * @param cfg getCopyConfig()
 * @param ourShares quantas shares deste token NÓS já temos (relevante p/ SELL)
 */
export function planCopyOrder(act, cfg, ourShares = 0) {
  const side = String(act.side || "").toUpperCase();
  const price = clamp(Number(act.price) || 0, 0.001, 0.999);
  const sourceShares = Number(act.size) || 0;
  const sourceUsd = Number(act.usdcSize) || sourceShares * price;
  const slip = cfg.slippageBps / 10000;

  const meta = {
    title: act.title || "—",
    outcome: act.outcome || "—",
    sourcePrice: price,
    sourceUsd: round(sourceUsd),
    sourceTx: act.transactionHash || null,
    conditionId: act.conditionId || null,
  };

  if (side !== "BUY" && side !== "SELL")
    return { skip: true, reason: `lado desconhecido (${act.side})`, meta };
  if (!act.asset) return { skip: true, reason: "sem tokenID (asset)", meta };
  if (sourceUsd < cfg.minSourceUsd)
    return { skip: true, reason: `trade de origem abaixo de ${cfg.minSourceUsd} USDC`, meta };

  if (side === "BUY") {
    let spend = cfg.sizeMode === "fixed" ? cfg.fixedUsd : sourceUsd * cfg.scale;
    spend = clamp(spend, cfg.minUsd, cfg.maxUsdPerTrade);
    if (spend < cfg.minUsd) return { skip: true, reason: "abaixo do mínimo", meta };
    const limitPrice = Math.min(round(price * (1 + slip), 3), 0.999);
    return {
      skip: false,
      side: "BUY",
      tokenID: act.asset,
      amountUsd: round(spend),
      limitPrice,
      estShares: round(spend / limitPrice),
      meta,
    };
  }

  // SELL: só vende o que temos
  if (ourShares <= 0) return { skip: true, reason: "não temos posição para vender", meta };
  const targetShares = cfg.sizeMode === "fixed" ? cfg.fixedUsd / price : sourceShares * cfg.scale;
  let shares = Math.min(targetShares, ourShares);
  if (shares * price > cfg.maxUsdPerTrade) shares = cfg.maxUsdPerTrade / price;
  shares = round(shares);
  if (shares * price < cfg.minUsd) return { skip: true, reason: "abaixo do mínimo", meta };
  const limitPrice = Math.max(round(price * (1 - slip), 3), 0.001);
  return {
    skip: false,
    side: "SELL",
    tokenID: act.asset,
    amountShares: shares,
    limitPrice,
    estUsd: round(shares * price),
    meta,
  };
}

export const planCost = (plan) => (plan.side === "BUY" ? plan.amountUsd : plan.estUsd) || 0;
