// app/api/copy/run/route.js
// Endpoint do ciclo de copy trading. Acionado pelo Vercel Cron (GET com
// header Authorization: Bearer $CRON_SECRET) ou manualmente com o mesmo segredo.

import { runCopyCycle } from "../../../../lib/copytrade";
import { sendWhatsApp, summarize } from "../../../../lib/notify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request) {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) return false; // fail-safe: sem segredo, endpoint fica fechado
  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function handle(request) {
  if (!authorized(request)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const result = await runCopyCycle();

  // Alerta best-effort (não bloqueia/derruba o ciclo).
  try {
    const msg = summarize(result);
    if (msg) await sendWhatsApp(msg);
  } catch {
    /* ignore */
  }

  return Response.json(result, {
    status: result.ok ? 200 : 422,
    headers: { "Cache-Control": "no-store" },
  });
}

export const GET = handle;
export const POST = handle;
