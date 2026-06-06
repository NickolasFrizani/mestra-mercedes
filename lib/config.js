// lib/config.js
// Lê e valida a configuração de copy trading a partir de variáveis de ambiente.
// Nenhum segredo é exposto ao cliente — usado apenas no servidor.

const num = (v, def) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : def;
};

const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

/** Configuração pública (sem segredos) — pode ser devolvida em /status. */
export function getCopyConfig() {
  const targets = String(process.env.COPY_TARGET_WALLETS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => ADDR_RE.test(s));

  const sizeMode = process.env.COPY_SIZE_MODE === "proportional" ? "proportional" : "fixed";

  return {
    targets,
    sizeMode,
    fixedUsd: num(process.env.COPY_FIXED_USDC, 5),
    scale: num(process.env.COPY_SCALE, 0.01),
    minUsd: num(process.env.COPY_MIN_USDC, 1),
    maxUsdPerTrade: num(process.env.COPY_MAX_USDC_PER_TRADE, 25),
    maxUsdPerRun: num(process.env.COPY_MAX_USDC_PER_RUN, 100),
    minSourceUsd: num(process.env.COPY_MIN_SOURCE_USDC, 50),
    slippageBps: num(process.env.COPY_SLIPPAGE_BPS, 150), // 1.5% padrão
    live: process.env.COPY_LIVE === "true",
  };
}

/** Configuração sensível (credenciais) — só no servidor, nunca serializar. */
export function getSecrets() {
  return {
    apiKey: process.env.POLYMARKET_API_KEY || "",
    secret: process.env.POLYMARKET_SECRET || "",
    passphrase: process.env.POLYMARKET_PASSPHRASE || "",
    mnemonic: process.env.POLYMARKET_WALLET_MNEMONIC || "",
    signatureType: num(process.env.POLYMARKET_SIGNATURE_TYPE, 2),
    funderAddress: process.env.POLYMARKET_FUNDER_ADDRESS || "",
    rpcUrl: process.env.POLYGON_RPC_URL || "",
    blobToken: process.env.BLOB_READ_WRITE_TOKEN || "",
  };
}

/**
 * Valida a configuração para o modo desejado.
 * Retorna { ok, errors[] }. Em modo live as exigências são mais estritas.
 */
export function validateConfig(cfg, secrets) {
  const errors = [];
  if (cfg.targets.length === 0) errors.push("COPY_TARGET_WALLETS vazio ou inválido.");
  if (cfg.minUsd <= 0) errors.push("COPY_MIN_USDC deve ser > 0.");
  if (cfg.maxUsdPerTrade < cfg.minUsd) errors.push("COPY_MAX_USDC_PER_TRADE < COPY_MIN_USDC.");
  if (cfg.sizeMode === "proportional" && cfg.scale <= 0) errors.push("COPY_SCALE deve ser > 0.");

  if (cfg.live) {
    if (!secrets.apiKey || !secrets.secret || !secrets.passphrase)
      errors.push("Credenciais Polymarket (API key/secret/passphrase) ausentes — exigidas em modo live.");
    if (!secrets.mnemonic) errors.push("POLYMARKET_WALLET_MNEMONIC ausente — exigido para assinar ordens.");
    if (secrets.signatureType !== 0 && !secrets.funderAddress)
      errors.push("POLYMARKET_FUNDER_ADDRESS exigido quando POLYMARKET_SIGNATURE_TYPE != 0.");
    if (!secrets.blobToken)
      errors.push("BLOB_READ_WRITE_TOKEN exigido em modo live (dedupe persistente contra ordens duplicadas).");
  }
  return { ok: errors.length === 0, errors };
}
