// lib/polymarket.js
// Helpers de leitura da API pública de dados da Polymarket (data-api.polymarket.com).
// Tudo aqui é SOMENTE LEITURA — nenhuma chave privada, nenhuma ordem é enviada.
// Docs: https://data-api.polymarket.com/  (endpoints /trades, /positions, /value)

const DATA_API = "https://data-api.polymarket.com";

/** Valida um endereço Ethereum/Polygon (0x + 40 hex). */
export function isValidAddress(addr) {
  return typeof addr === "string" && /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

async function getJson(url) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Polymarket API ${res.status} em ${url}`);
  }
  return res.json();
}

/**
 * Busca os trades de uma carteira, paginando até `max` registros.
 * Cada item: { side, size, price, timestamp, title, conditionId, outcome, ... }
 */
export async function fetchTrades(address, max = 500) {
  const pageSize = 100;
  const out = [];
  for (let offset = 0; offset < max; offset += pageSize) {
    const limit = Math.min(pageSize, max - offset);
    const url = `${DATA_API}/trades?user=${address}&limit=${limit}&offset=${offset}`;
    const page = await getJson(url);
    if (!Array.isArray(page) || page.length === 0) break;
    out.push(...page);
    if (page.length < limit) break;
  }
  return out;
}

/** Posições atuais da carteira (abertas e resolvidas não-redimidas). */
export async function fetchPositions(address) {
  const url = `${DATA_API}/positions?user=${address}&sortBy=CURRENT&sortDirection=DESC&limit=500`;
  const page = await getJson(url);
  return Array.isArray(page) ? page : [];
}

/**
 * Atividade on-chain de uma carteira (trades, splits, merges...).
 * Para copy trading usamos type=TRADE, em ordem cronológica crescente,
 * opcionalmente filtrando por `start` (timestamp em segundos).
 * Item: { proxyWallet, timestamp, conditionId, type, size, usdcSize, price,
 *         asset, side, outcome, title, transactionHash, ... }
 */
export async function fetchActivity(address, { type = "TRADE", start, limit = 100 } = {}) {
  const params = new URLSearchParams({
    user: address,
    type,
    sortBy: "TIMESTAMP",
    sortDirection: "ASC",
    limit: String(limit),
  });
  if (start) params.set("start", String(start));
  const url = `${DATA_API}/activity?${params.toString()}`;
  const page = await getJson(url);
  return Array.isArray(page) ? page : [];
}

/** Tamanho (em shares) que a carteira possui de um tokenID específico. */
export async function fetchPositionSize(address, tokenId) {
  const positions = await fetchPositions(address);
  const pos = positions.find((p) => p.asset === tokenId);
  return pos ? n(pos.size) : 0;
}

/** Valor total em USD das posições da carteira. */
export async function fetchValue(address) {
  const url = `${DATA_API}/value?user=${address}`;
  const data = await getJson(url);
  // Resposta costuma ser [{ user, value }]
  if (Array.isArray(data)) return Number(data[0]?.value ?? 0);
  return Number(data?.value ?? 0);
}

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Estatísticas derivadas dos trades. */
export function computeTradeStats(trades) {
  const stats = {
    totalTrades: trades.length,
    buys: 0,
    sells: 0,
    volumeUsd: 0,
    avgTradeUsd: 0,
    uniqueMarkets: 0,
    firstTs: null,
    lastTs: null,
    topMarkets: [],
    outcomes: {},
    recent: [],
  };
  if (trades.length === 0) return stats;

  const markets = new Map(); // conditionId -> { title, trades, volume }
  for (const t of trades) {
    const side = String(t.side || "").toUpperCase();
    if (side === "BUY") stats.buys++;
    else if (side === "SELL") stats.sells++;

    const usd = n(t.size) * n(t.price);
    stats.volumeUsd += usd;

    const ts = n(t.timestamp);
    if (ts) {
      if (stats.firstTs === null || ts < stats.firstTs) stats.firstTs = ts;
      if (stats.lastTs === null || ts > stats.lastTs) stats.lastTs = ts;
    }

    const key = t.conditionId || t.title || "?";
    const m = markets.get(key) || { title: t.title || key, trades: 0, volume: 0 };
    m.trades++;
    m.volume += usd;
    markets.set(key, m);

    const outcome = t.outcome || "—";
    stats.outcomes[outcome] = (stats.outcomes[outcome] || 0) + 1;
  }

  stats.uniqueMarkets = markets.size;
  stats.avgTradeUsd = stats.volumeUsd / trades.length;
  stats.topMarkets = [...markets.values()]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6);
  stats.recent = trades.slice(0, 12).map((t) => ({
    side: String(t.side || "").toUpperCase(),
    title: t.title || "—",
    outcome: t.outcome || "—",
    size: n(t.size),
    price: n(t.price),
    usd: n(t.size) * n(t.price),
    timestamp: n(t.timestamp),
  }));

  return stats;
}

/** Estatísticas derivadas das posições (PnL, win rate, maiores ganhos/perdas). */
export function computePositionStats(positions) {
  const stats = {
    openPositions: positions.length,
    currentValue: 0,
    cashPnl: 0,
    realizedPnl: 0,
    winners: 0,
    losers: 0,
    winRate: 0,
    topWinners: [],
    topLosers: [],
  };
  if (positions.length === 0) return stats;

  let decided = 0;
  for (const p of positions) {
    stats.currentValue += n(p.currentValue);
    stats.cashPnl += n(p.cashPnl);
    stats.realizedPnl += n(p.realizedPnl);
    const pnl = n(p.cashPnl);
    if (pnl > 0) {
      stats.winners++;
      decided++;
    } else if (pnl < 0) {
      stats.losers++;
      decided++;
    }
  }
  stats.winRate = decided > 0 ? stats.winners / decided : 0;

  const byPnl = [...positions]
    .map((p) => ({
      title: p.title || "—",
      outcome: p.outcome || "—",
      cashPnl: n(p.cashPnl),
      percentPnl: n(p.percentPnl),
      currentValue: n(p.currentValue),
    }))
    .sort((a, b) => b.cashPnl - a.cashPnl);

  stats.topWinners = byPnl.filter((p) => p.cashPnl > 0).slice(0, 5);
  stats.topLosers = byPnl
    .filter((p) => p.cashPnl < 0)
    .slice(-5)
    .reverse();

  return stats;
}

/** Orquestra: busca tudo e devolve um objeto de análise pronto para a UI. */
export async function analyzeTrader(address) {
  const [trades, positions, value] = await Promise.all([
    fetchTrades(address),
    fetchPositions(address),
    fetchValue(address).catch(() => 0),
  ]);

  const tradeStats = computeTradeStats(trades);
  const positionStats = computePositionStats(positions);

  // Tenta extrair um nome/pseudônimo do perfil a partir dos trades.
  const sample = trades.find((t) => t.name || t.pseudonym) || {};

  return {
    address,
    profile: {
      name: sample.name || null,
      pseudonym: sample.pseudonym || null,
      image: sample.profileImage || null,
    },
    portfolioValue: value,
    trades: tradeStats,
    positions: positionStats,
    fetchedAt: Date.now(),
  };
}
