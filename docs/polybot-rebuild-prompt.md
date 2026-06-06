# Prompt para recriar o "Polybot" (copy trading da Polymarket) em outra LLM

Copie tudo dentro do bloco abaixo e cole na LLM de sua escolha. Substitua os
`<PLACEHOLDERS>` pelas suas credenciais **no ambiente de deploy** (nunca no chat/código).

---

````text
Você é um engenheiro sênior. Construa um bot de COPY TRADING para a Polymarket,
do zero, completo e pronto para deploy. Siga exatamente a especificação abaixo.

## Objetivo
Observar uma ou mais carteiras-alvo na Polymarket e REPLICAR automaticamente cada
trade delas na MINHA conta, de forma autônoma (sem eu apertar nada), com modo de
"cópia fiel 1:1" como padrão. Somente leitura para detectar; escrita só para enviar
minhas próprias ordens. Segurança em primeiro lugar: começa em SIMULAÇÃO.

Carteira-alvo padrão (perfil @coldmath):
  0x594edb9112f526fa6a80b8f858a6379c8a2c1c11

## Stack
- Next.js (App Router) + React, deploy na Vercel (funções serverless, stateless).
- Node.js. Dependências: @polymarket/clob-client (v5.x), ethers (v5), @vercel/blob.
- Estado persistente: Vercel Blob. Agendamento: GitHub Actions (cron */5).

## API pública de dados da Polymarket (SOMENTE LEITURA, sem auth)
Base: https://data-api.polymarket.com

GET /activity?user={addr}&type=TRADE&sortBy=TIMESTAMP&sortDirection=ASC&start={ts}&limit=100
  -> [{ proxyWallet, timestamp(seg), conditionId, type, size(shares), usdcSize,
        price, asset(tokenID), side(BUY|SELL), outcome, outcomeIndex, title,
        transactionHash }]
  Use este endpoint para detectar trades novos do alvo (filtra por start=cursor).

GET /trades?user={addr}&limit=500&offset=0   (alternativa a /activity)
  -> [{ proxyWallet, side, asset, conditionId, size, price, timestamp, title,
        outcome, outcomeIndex, transactionHash, name, pseudonym, profileImage }]

GET /positions?user={addr}&sortBy=CURRENT&sortDirection=DESC&limit=500
  -> [{ proxyWallet, asset, conditionId, size, avgPrice, initialValue,
        currentValue, cashPnl, percentPnl, totalBought, realizedPnl, curPrice,
        redeemable, title, outcome, outcomeIndex, endDate }]
  Use para saber quantas shares EU tenho de um token (campo size, filtrando asset).

GET /value?user={addr}  -> [{ user, value }]   (valor total das posições em USD)

## Execução de ordens — CLOB (@polymarket/clob-client v5.x)
- Signer: ethers v5  ->  const signer = Wallet.fromMnemonic(MNEMONIC)
- Cliente:
    new ClobClient(
      "https://clob.polymarket.com",   // host
      137,                             // chainId (Polygon)
      signer,
      { key, secret, passphrase },     // credenciais L2 da API Polymarket
      signatureType,                   // 0=EOA, 1=Email/Magic, 2=Proxy (conta da UI Polymarket)
      funderAddress                    // se type 0: endereço do signer; senão: endereço que detém o USDC
    )
- Enviar ordem marketável (FOK), ideal para copiar:
    client.createAndPostMarketOrder(
      { tokenID, amount, side, price },  // amount = USD (BUY) | shares (SELL); price = pior preço aceitável
      undefined,
      OrderType.FOK
    )
  Enums: Side.BUY/Side.SELL, OrderType.FOK. (UserMarketOrder: { tokenID, price?, amount, side, feeRateBps?, nonce?, taker? })

## Lógica de dimensionamento (função PURA, testável) — planCopyOrder(act, cfg, ourShares)
Entradas: atividade TRADE do alvo (act), config (cfg), e quantas shares EU já tenho (ourShares).
Defina:
  price       = clamp(act.price, 0.001, 0.999)
  sourceShares= act.size
  sourceUsd   = act.usdcSize || sourceShares*price
  slip        = cfg.slippageBps/10000
Regras de skip:
  - lado != BUY/SELL  -> skip
  - sem act.asset     -> skip
  - sourceUsd < cfg.minSourceUsd -> skip   (em modo fiel, minSourceUsd=0 => copia tudo)
BUY:
  spend = (mode=="mirror") ? sourceUsd
        : (mode=="fixed")   ? cfg.fixedUsd
        :                     sourceUsd*cfg.scale
  spend = clamp(spend, cfg.minUsd, cfg.maxUsdPerTrade)
  limitPrice = min(round(price*(1+slip),3), 0.999)
  -> ordem BUY: amount=spend (USD), price=limitPrice, estShares=spend/limitPrice
SELL (só vende o que tenho):
  if ourShares <= 0 -> skip
  targetShares = (mode=="mirror") ? sourceShares
               : (mode=="fixed")  ? cfg.fixedUsd/price
               :                    sourceShares*cfg.scale
  shares = min(targetShares, ourShares)
  if shares*price > cfg.maxUsdPerTrade -> shares = cfg.maxUsdPerTrade/price
  if shares*price < cfg.minUsd -> skip
  limitPrice = max(round(price*(1-slip),3), 0.001)
  -> ordem SELL: amount=shares, price=limitPrice, estUsd=shares*price

"mirror" = cópia FIEL 1:1 (mesmo valor/quantidade do alvo). É o modo PADRÃO.

## Ciclo de execução — runCopyCycle()
1. Carrega config (env) e valida. Em modo live exige: credenciais, mnemônico,
   funderAddress (se signatureType!=0) e Blob token. Senão, retorna erros.
2. Carrega estado do Blob: { cursors:{[wallet]:lastTs}, seen:[txKey...], lastRun }.
3. Para cada carteira-alvo:
   - start = cursors[wallet] || (now - COPY_LOOKBACK_SECONDS)  (padrão 3600)
   - busca /activity TRADE desde start
   - para cada trade (key = `${transactionHash}:${asset}`, pular se já em seen):
       - se SELL e live: busca minhas shares do asset (via /positions)
       - plan = planCopyOrder(...)
       - se skip: registra e marca seen
       - aplica teto por ciclo: se runSpend+cost > COPY_MAX_USDC_PER_RUN, pula (NÃO marca seen)
       - dry-run (COPY_LIVE=false): registra "simulada", marca seen
       - live (COPY_LIVE=true): envia via CLOB (FOK), registra resultado/erro, marca seen
   - atualiza cursors[wallet] = maior timestamp visto
4. Salva estado (cursors, seen[últimos ~2000], lastRun com resumo enxuto).
5. (Opcional) envia alerta resumido por WhatsApp (Evolution API), best-effort, sem derrubar o ciclo.

## Estrutura de arquivos
- lib/config.js      : lê/valida env (config pública + segredos). Default sizeMode="mirror",
                       minSourceUsd=0 quando mirror, alvo padrão = @coldmath se vazio.
- lib/copy-plan.js   : planCopyOrder (PURA) + helpers clamp/round + planCost. COM testes unitários.
- lib/copytrade.js   : runCopyCycle (polling, dedupe, caps, dry-run/live).
- lib/polymarket.js  : fetchActivity, fetchTrades, fetchPositions, fetchPositionSize, fetchValue.
- lib/clob.js        : getClob(secrets) -> { place(plan) } (import dinâmico, só no modo live).
- lib/store.js       : loadState/saveState no Vercel Blob (path estável "copy-trade/state.json",
                       fallback em memória se sem token).
- lib/notify.js      : sendWhatsApp(text) via Evolution API + summarize(result).
- app/api/copy/run   : Route Handler (GET/POST) protegido por CRON_SECRET; chama runCopyCycle;
                       export dynamic="force-dynamic", maxDuration=60.
- app/api/copy/status: Route Handler GET protegido; devolve config/validação/credenciais(boolean)/
                       cursors/lastRun. NUNCA serializa segredos.
- app/copy/page.js   : painel read-only ("use client"); pede CRON_SECRET e chama /status com
                       header Authorization: Bearer; mostra estado/parâmetros/alvos/último ciclo.
- app/trader/page.js + app/api/trader : (opcional) análise read-only de qualquer carteira
                       (PnL, win rate, mercados, ganhos/perdas, trades recentes).

## Variáveis de ambiente
POLYMARKET_API_KEY=<...>            POLYMARKET_SECRET=<...>        POLYMARKET_PASSPHRASE=<...>
POLYMARKET_WALLET_MNEMONIC=<12 palavras>   POLYMARKET_SIGNATURE_TYPE=2
POLYMARKET_FUNDER_ADDRESS=<endereço Polymarket que detém o USDC>
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/<INFURA_KEY>
BLOB_READ_WRITE_TOKEN=<Vercel Blob>        CRON_SECRET=<aleatório, protege os endpoints>
COPY_TARGET_WALLETS=0x594edb9112f526fa6a80b8f858a6379c8a2c1c11
COPY_SIZE_MODE=mirror              COPY_FIXED_USDC=5        COPY_SCALE=0.01
COPY_MIN_USDC=1                    COPY_MAX_USDC_PER_TRADE=25   COPY_MAX_USDC_PER_RUN=100
COPY_MIN_SOURCE_USDC=0             COPY_SLIPPAGE_BPS=150        COPY_LOOKBACK_SECONDS=3600
COPY_LIVE=false                    # false=simulação | true=ordens reais
EVOLUTION_API_URL=<...> EVOLUTION_API_KEY=<...> EVOLUTION_INSTANCE=<...> EVOLUTION_ALERT_TO=<...>
# Segredos só em variáveis de ambiente do servidor. NUNCA em git nem em NEXT_PUBLIC_*.

## Agendamento (autônomo)
A Vercel é stateless/efêmera -> estado no Blob + gatilho externo.
NÃO use cron nativo da Vercel no plano Hobby (rejeita schedule sub-diário em vercel.json e
QUEBRA o deploy; Hobby só roda 1x/dia). Use GitHub Actions:
  .github/workflows/copy-trade.yml -> on.schedule cron "*/5 * * * *" + workflow_dispatch;
  faz curl GET em ${COPY_RUN_URL} com header "Authorization: Bearer ${CRON_SECRET}".
  Observação: workflows agendados só rodam no BRANCH PADRÃO (main).
No Vercel Pro: alternativamente vercel.json com crons */5 (a Vercel injeta o header de auth).

## Segurança (obrigatório)
- COPY_LIVE=false por padrão (simulação/paper). Live só por opt-in explícito.
- Teto por ordem (COPY_MAX_USDC_PER_TRADE) e por ciclo (COPY_MAX_USDC_PER_RUN).
- Ordens FOK com price = pior preço aceitável (proteção de slippage).
- Dedupe persistente (Blob) por `${transactionHash}:${asset}` — nunca copiar 2x.
- SELL só vende shares que EU já possuo; nunca abre venda a descoberto.
- Endpoints fechados sem CRON_SECRET.
- Validar tudo em simulação antes de COPY_LIVE=true; começar com tetos baixos.

## Testes
Inclua testes unitários de planCopyOrder cobrindo: BUY/SELL nos 3 modos (mirror/fixed/
proportional), clamp nos tetos, skip por minSourceUsd, SELL limitado à posição, e "copia
tudo" (minSourceUsd=0). Inclua npm scripts e instruções de deploy (Vercel + GitHub Actions).

## Limitações conhecidas (documente)
- Copy por latência: quando o trade do alvo aparece on-chain e é copiado, o mercado já
  pode ter se movido — a cópia tende a preencher pior (especialmente traders rápidos de
  clima como @coldmath). Em modo fiel 1:1 o risco financeiro escala junto.
- Em modo fiel os tetos LIMITAM a fidelidade; para 1:1 real, suba-os e tenha o capital.
- Teste a execução live em produção (em simulação) antes de operar com dinheiro real.

Entregue o código completo de todos os arquivos, com comentários, pronto para `vercel deploy`.
````
