// app/api/copy/status/route.js
// Status somente-leitura do copy trading: configuração pública (sem segredos),
// validação e cursores salvos. Protegido pelo mesmo CRON_SECRET.

import { getCopyConfig, getSecrets, validateConfig } from "../../../../lib/config";
import { loadState } from "../../../../lib/store";

export const dynamic = "force-dynamic";

function authorized(request) {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;
  return new URL(request.url).searchParams.get("secret") === secret;
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const cfg = getCopyConfig();
  const secrets = getSecrets();
  const validation = validateConfig(cfg, secrets);
  const state = await loadState(secrets.blobToken);

  // Indica presença de credenciais SEM revelá-las.
  const credentials = {
    apiKey: Boolean(secrets.apiKey),
    secret: Boolean(secrets.secret),
    passphrase: Boolean(secrets.passphrase),
    mnemonic: Boolean(secrets.mnemonic),
    funderAddress: secrets.funderAddress || null,
    signatureType: secrets.signatureType,
    blobConfigured: Boolean(secrets.blobToken),
  };

  return Response.json(
    {
      config: cfg,
      validation,
      credentials,
      cursors: state.cursors,
      seenCount: (state.seen || []).length,
      lastRun: state.lastRun || null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
