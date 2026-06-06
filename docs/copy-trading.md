# 🤖 Copy Trading de carteiras na Polymarket

Copia automaticamente os trades de carteiras-alvo ("smart money") para a sua conta
da Polymarket. **Começa sempre em modo simulação** — só envia ordens reais quando você
liga conscientemente o `COPY_LIVE=true`.

> ⚠️ **Dinheiro real.** Em modo live, o bot envia ordens com os seus fundos. Comece com
> valores baixíssimos, revise os logs de simulação primeiro e entenda os limites abaixo.
> Isto é uma ferramenta pessoal — não é recomendação de investimento.

---

## Como funciona

```
Vercel Cron (a cada 5 min)
   └─► GET /api/copy/run  (autenticado por CRON_SECRET)
          └─► runCopyCycle()
                 1. lê carteiras-alvo (COPY_TARGET_WALLETS)
                 2. busca trades novos de cada alvo  (data-api.polymarket.com /activity)
                 3. dimensiona a ordem copiada       (lib/copy-plan.js — testado)
                 4. dry-run: só registra  |  live: envia FOK no CLOB (lib/clob.js)
                 5. salva cursor/dedupe   (Vercel Blob — evita copiar 2x)
                 6. alerta no WhatsApp     (Evolution API, best-effort)
```

- **Estado/dedupe** em **Vercel Blob** (`copy-trade/state.json`): guarda o último timestamp
  por alvo e os trades já copiados, para nunca copiar o mesmo duas vezes.
- **Vercel é stateless/efêmero**, por isso o estado vive no Blob e o gatilho é um **Cron**
  (não um processo contínuo) — alinhado ao `AGENTS.md`.

---

## Arquivos

| Arquivo | Papel |
|---|---|
| `lib/config.js` | Lê/valida env (config pública + segredos) |
| `lib/copy-plan.js` | **Dimensionamento puro** da ordem (com testes) |
| `lib/copytrade.js` | Orquestra o ciclo (polling, dedupe, caps) |
| `lib/clob.js` | Execução real no CLOB (importado só no modo live) |
| `lib/store.js` | Cursor/dedupe no Vercel Blob |
| `lib/notify.js` | Alertas WhatsApp via Evolution API |
| `app/api/copy/run/route.js` | Endpoint do cron (protegido) |
| `app/api/copy/status/route.js` | Status só-leitura (sem segredos) |
| `vercel.json` | Agenda do cron (`*/5 * * * *`) |

---

## Configuração (variáveis de ambiente)

Copie `.env.example` para `.env.local` (local) e configure as mesmas em
**Vercel → Settings → Environment Variables** (produção). **Nunca** comite segredos.

### Credenciais
| Var | Descrição |
|---|---|
| `POLYMARKET_API_KEY` / `POLYMARKET_SECRET` / `POLYMARKET_PASSPHRASE` | Credenciais L2 do CLOB |
| `POLYMARKET_WALLET_MNEMONIC` | Mnemônico que assina/financia as ordens (só no servidor) |
| `POLYMARKET_SIGNATURE_TYPE` | `0`=EOA, `1`=Email/Magic, `2`=Proxy (conta da UI Polymarket) |
| `POLYMARKET_FUNDER_ADDRESS` | Endereço que detém o USDC (obrigatório se tipo ≠ 0) |
| `POLYGON_RPC_URL` | RPC Polygon (Infura/Alchemy) |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob (obrigatório em live) |
| `CRON_SECRET` | Protege `/api/copy/run` e `/api/copy/status` |
| `EVOLUTION_*` | Alertas WhatsApp (opcional) |
| `OPENAI_API_KEY` | Análise opcional (não usado no fluxo base) |

### Parâmetros de cópia
| Var | Padrão | Descrição |
|---|---|---|
| `COPY_TARGET_WALLETS` | — | Carteiras a copiar (CSV de `0x...`) |
| `COPY_SIZE_MODE` | `fixed` | `fixed` (valor fixo) ou `proportional` (escala do original) |
| `COPY_FIXED_USDC` | `5` | USDC por ordem (modo fixed) |
| `COPY_SCALE` | `0.01` | Fração do trade original (modo proportional) |
| `COPY_MIN_USDC` | `1` | Piso por ordem |
| `COPY_MAX_USDC_PER_TRADE` | `25` | Teto por ordem |
| `COPY_MAX_USDC_PER_RUN` | `100` | Teto por ciclo (freio de emergência) |
| `COPY_MIN_SOURCE_USDC` | `50` | Ignora trades pequenos do alvo |
| `COPY_SLIPPAGE_BPS` | `150` | Slippage máx. (pior preço aceitável) — 150 = 1,5% |
| `COPY_LOOKBACK_SECONDS` | `3600` | Janela inicial no 1º ciclo de cada alvo |
| `COPY_LIVE` | `false` | **`false`=simulação, `true`=ordens reais** |

---

## Passo a passo

1. **Configure** as credenciais e `COPY_TARGET_WALLETS` no `.env.local` / Vercel.
2. **Gere um `CRON_SECRET`** aleatório (ex.: `openssl rand -hex 32`).
3. **Deixe `COPY_LIVE=false`** e rode em simulação por alguns dias:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://SEU-APP.vercel.app/api/copy/run
   ```
   Veja em `planned[]` quais ordens *seriam* enviadas.
4. **Revise** os tamanhos, slippage e alvos. Confira o status:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://SEU-APP.vercel.app/api/copy/status
   ```
5. **Para ir ao vivo:** crie um **Vercel Blob store**, defina `BLOB_READ_WRITE_TOKEN`,
   confirme `POLYMARKET_FUNDER_ADDRESS`/`SIGNATURE_TYPE`, garanta saldo de USDC e só então
   `COPY_LIVE=true`. Comece com `COPY_FIXED_USDC` e `COPY_MAX_USDC_PER_RUN` bem baixos.

---

## Limites de segurança (já embutidos)

- **Simulação por padrão** (`COPY_LIVE=false`).
- **Teto por ordem** e **teto por ciclo** (não estoura o saldo de uma vez).
- **Ordens FOK** com `limitPrice` = pior preço aceitável (proteção de slippage).
- **Dedupe persistente** (Blob) — não copia o mesmo trade duas vezes.
- **SELL só vende o que você tem**; nunca abre posição vendida.
- Endpoints **fechados** sem `CRON_SECRET`.

## Limitações conhecidas

- Não foi possível testar a execução **live** a partir do ambiente de desenvolvimento
  (a rede bloqueia `data-api`/`clob.polymarket.com`). **Teste no deploy da Vercel, em
  simulação, antes de ligar o live.**
- Copiar **vendas** depende de você já ter a posição correspondente.
- O `lookback` inicial pode copiar trades recentes do alvo no primeiro ciclo — ajuste
  `COPY_LOOKBACK_SECONDS` se quiser começar "do zero".
