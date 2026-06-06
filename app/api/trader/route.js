// app/api/trader/route.js
// Route Handler (App Router, Next 16) — análise de um trader da Polymarket.
// GET /api/trader?address=0x...  -> JSON com estatísticas (somente leitura).

import { analyzeTrader, isValidAddress } from "../../../lib/polymarket";

// Função efêmera/stateless (boas práticas Vercel) — sem cache de borda aqui.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") || "").trim();

  if (!isValidAddress(address)) {
    return Response.json(
      { error: "Endereço inválido. Use uma carteira no formato 0x + 40 caracteres hexadecimais." },
      { status: 400 }
    );
  }

  try {
    const data = await analyzeTrader(address);
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return Response.json(
      { error: "Falha ao consultar a API da Polymarket.", detail: String(err?.message || err) },
      { status: 502 }
    );
  }
}
