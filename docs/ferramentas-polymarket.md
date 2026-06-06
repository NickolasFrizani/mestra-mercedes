# 🛠️ Ferramentas Gratuitas para Trading na Polymarket

> **Lista curada e traduzida para o português** — 11 repositórios open source para
> automatizar, analisar e facilitar o trading em mercados de previsão (Polymarket,
> Kalshi e similares).
>
> Adaptado a partir da thread original em inglês de [@recogard no X/Twitter](https://x.com/recogard/status/2062985176880230809).
> Todos os projetos são **gratuitos** e vêm com guias de instalação e uso passo a passo
> (na maioria, em inglês).

---

## ⚠️ Aviso importante

- **Risco financeiro:** trading em mercados de previsão envolve risco real de perda de
  capital. As ferramentas abaixo são para fins **educacionais e de pesquisa**. Nada aqui
  é recomendação de investimento.
- **Conformidade legal:** verifique se o uso da Polymarket é permitido na sua jurisdição
  antes de operar. No Brasil, avalie as regras vigentes.
- **Segurança de chaves:** **nunca** coloque chaves privadas, seed phrases ou API keys
  em arquivos versionados (git) ou em variáveis `NEXT_PUBLIC_*`. Use variáveis de
  ambiente seguras (ex.: Vercel Env Variables) — conforme as boas práticas já adotadas
  neste projeto (ver `AGENTS.md`).
- **Repositórios de terceiros:** revise o código antes de executar. Já houve casos de
  bots maliciosos disfarçados de ferramentas de trading que roubam chaves de carteira.

---

## 📑 Índice por categoria

| Categoria | Ferramentas |
|-----------|-------------|
| 📊 Dados & Pesquisa | [1. Dataset Polymarket](#1-dataset-polymarket-1-bilhão-de-trades) · [9. PMXT](#9-pmxt--api-unificada-de-mercados-de-previsão) |
| 🧪 Backtesting & Simulação | [2. Prediction Market Backtesting](#2-prediction-market-backtesting--simulador-de-estratégias) |
| 🔍 Análise de Traders | [3. Polybot](#3-polybot--engenharia-reversa-de-estratégias) |
| 💧 Liquidez & Market Making | [4. Bot de Liquidez](#4-bot-de-recompensas-de-liquidez) · [10. Toolkit Multi-estratégia](#10-toolkit-de-trading-multi-estratégia) |
| 🌦️ Estratégias específicas | [5. PolyWeather](#5-polyweather--bot-de-clima) |
| ⚡ Multi-estratégia & Arbitragem | [6. CloddsBot](#6-cloddsbot--118-estratégias-automatizadas) |
| 🤖 Agentes de IA | [7. Pydantic AI](#7-pydantic-ai--construção-de-agentes-de-ia) · [8. TradingAgents](#8-tradingagents--dashboard-multi-agente) |
| 📚 Listas & Recursos | [11. Awesome Prediction Market Tools](#11-awesome-prediction-market-tools--lista-com-100-recursos) |

---

## 1. Dataset Polymarket (1,1 bilhão de trades)

🔗 **GitHub:** https://github.com/SII-WANGZJ/Polymarket_data
🔗 **HuggingFace:** https://huggingface.co/datasets/SII-WANGZJ/Polymarket_data

O **maior dataset público da Polymarket**, com mais de **107 GB** de dados reais de
trading baseados em **mais de 1,1 bilhão de registros de negociação** em mais de 268 mil
mercados. Trabalho de pesquisadores ligados a instituições como o Shanghai Innovation
Institute, Westlake University, Shanghai Jiao Tong University, Harbin Institute of
Technology e Fudan University.

**Para que serve:** pesquisa de mercado, estudos de comportamento e análise quantitativa.
Os dados vêm direto da blockchain Polygon e da Gamma API, já processados em formatos
prontos para análise (dados limpos, perspectiva unificada de tokens e transformações
por usuário).

---

## 2. Prediction Market Backtesting — Simulador de estratégias

🔗 **GitHub:** https://github.com/evan-kolberg/prediction-market-backtesting
🔗 **Docs:** https://evan-kolberg.github.io/prediction-market-backtesting/

Um **simulador de backtesting funcional** que permite testar suas próprias ideias e
estratégias em mercados históricos reais, para estimar o **PnL potencial e os riscos**.
Construído como extensão do **NautilusTrader**.

**Recursos:** gráficos de um ou múltiplos mercados com acompanhamento de equity, ticks de
lucro/prejuízo, alocação de mercado, análise de drawdown, índice de Sharpe, retornos
mensais e vantagem de Brier acumulada.

---

## 3. Polybot — Engenharia reversa de estratégias

🔗 **GitHub:** https://github.com/ent0n29/polybot

Ferramenta que **analisa o comportamento real de qualquer trader da Polymarket**, encontra
padrões repetidos nos trades, mostra quais estratégias ele usa e como adaptá-las ao seu
próprio trading.

**Arquitetura:** microsserviços em Java 21 para execução, estratégia, ingestão e analytics;
pipeline de eventos com ClickHouse e Redpanda; stack de monitoramento com Grafana,
Prometheus e Alertmanager. Suporta modos **paper trading** (teste) e **live**.

---

## 4. Bot de recompensas de liquidez

🔗 **GitHub (handle citado na thread):** https://github.com/lihanyu81
> ⚠️ *O nome exato do repositório não pôde ser confirmado por busca pública — o link
> original da thread estava truncado (`github.com/lihanyu81/poly…`). Confira o perfil do
> autor para localizar o repositório correto.*

Bot que **gerencia automaticamente suas ordens-limite na Polymarket para maximizar as
recompensas de liquidez** (liquidity rewards). O programa de recompensas paga quem coloca
ordens-limite que mantêm o mercado ativo e equilibrado — quanto mais perto do preço médio,
maior o ganho.

**Alternativas open source na mesma categoria** (caso o repositório original esteja
indisponível):
- [warproxxx/poly-maker](https://github.com/warproxxx/poly-maker) — market making configurável via Google Sheets
- [RuneDn/polymarket-liquidity-bot](https://github.com/RuneDn/polymarket-liquidity-bot) — farm de liquidity rewards

---

## 5. PolyWeather — Bot de clima

🔗 **GitHub:** https://github.com/yangyuan-zhen/PolyWeather

Bot de clima que **analisa múltiplas fontes em tempo real** — previsões, dados de
aeroportos e observações aeronáuticas (**METAR + SPECI/TAF**) — para gerar um relatório
detalhado do tempo para uma cidade e dia específicos, mapeando o resultado para os
mercados de temperatura da Polymarket.

**Stack:** frontend em Next.js + backend em FastAPI. Agrega METAR, TAF, Open-Meteo, redes
regionais (Japão/Coreia/Turquia) e fontes oficiais de liquidação (HKO/CWA/NOAA). Suporta
usuários web e via bot do Telegram.

---

## 6. CloddsBot — 118+ estratégias automatizadas

🔗 **GitHub:** https://github.com/alsk1992/CloddsBot

Bot com **mais de 118 estratégias e ferramentas prontas** para trading em mercados de
previsão, incluindo **arbitragem entre Polymarket e Kalshi**, latência de preço
Polymarket–Binance, reversão à média (mean reversion) e muito mais.

**Recursos:** opera em mais de 1000 mercados (Polymarket, Kalshi, Binance, Hyperliquid,
DEXs na Solana e 5 chains EVM), detecta arbitragem com matching semântico e sizing por
critério de Kelly, faz whale tracking, copy trading e roteamento inteligente. Self-hosted
e construído sobre o Claude.

---

## 7. Pydantic AI — Construção de agentes de IA

🔗 **GitHub:** https://github.com/pydantic/pydantic-ai

Ferramenta útil para **construir seus próprios agentes de IA** e conectá-los ao seu fluxo
de trabalho de trading. É um framework de agentes em Python, com tipagem forte e validação
via Pydantic, agnóstico de modelo (funciona com vários provedores de LLM).

> 💡 **Nota para este projeto:** caso integremos IA no `mestra-mercedes` (ex.: assistente
> de agendamento no `BookingModal`), o padrão recomendado em `AGENTS.md` é usar o
> **Vercel AI Gateway** com a AI SDK e os modelos Claude mais recentes.

---

## 8. TradingAgents — Dashboard multi-agente

🔗 **GitHub:** https://github.com/TauricResearch/TradingAgents
🔗 **Docs:** https://tauricresearch.github.io/TradingAgents/

Dashboard de trading onde **múltiplos agentes de IA analisam um mercado selecionado sob
diferentes ângulos** (notícias, comportamento de preço, indicadores técnicos e riscos)
para ajudar na tomada de decisão.

**Arquitetura:** espelha a dinâmica de uma mesa de operações real — analistas
fundamentalistas, especialistas em sentimento, analistas técnicos, trader e time de gestão
de risco discutem dinamicamente a estratégia ótima. Suporta OpenAI, Google, Anthropic,
xAI, DeepSeek e modelos locais via Ollama. *Destinado a fins de pesquisa.*

---

## 9. PMXT — API unificada de mercados de previsão

🔗 **GitHub:** https://github.com/pmxt-dev/pmxt
🔗 **Site:** https://www.pmxt.dev/

Ferramenta que permite **buscar informações sobre qualquer mercado, preço ou trader
histórico** em diferentes plataformas de previsão dentro de um único dashboard. É o
"CCXT dos mercados de previsão": uma **API unificada** para Polymarket, Kalshi e outras.

**Mercados suportados:** Polymarket, Polymarket US, Kalshi, Limitless, Myriad, Opinion,
Metaculus, Smarkets, Hyperliquid, Gemini e Titan. Modelo de dados Event → Market → Outcome.
Inclui execução real de ordens, order books, histórico de trades, streaming de preços e
um **servidor MCP** para integração com agentes de IA. Requer Node.js ≥ 18 ou Python ≥ 3.8.

---

## 10. Toolkit de trading multi-estratégia

🔗 **GitHub (handle citado na thread):** https://github.com/HarrierOnChain
> ⚠️ *O nome exato do repositório não pôde ser confirmado por busca pública — o link
> original da thread estava truncado (`github.com/HarrierOnChain…`). Confira o perfil do
> autor para localizar o repositório correto.*

**Toolkit de bots de trading** que inclui **copy trading, arbitragem, market making, spread
farming, alertas de whales** e mais.

**Alternativas open source na mesma categoria** (caso o repositório original esteja
indisponível):
- [Drakkar-Software/OctoBot-Prediction-Market](https://github.com/Drakkar-Software/OctoBot-Prediction-Market) — copy trading e arbitragem com interface simples
- [direkturcrypto/polymarket-terminal](https://github.com/direkturcrypto/polymarket-terminal) — copy, scalping e sniper

---

## 11. Awesome Prediction Market Tools — Lista com 100+ recursos

🔗 **GitHub:** https://github.com/aarora4/Awesome-Prediction-Market-Tools

A **maior lista pública** com mais de **100 ferramentas e serviços gratuitos** para a
Polymarket — de ferramentas de analytics e bots de trading a agentes de IA e recursos
educacionais. Comunidade-mantida, cobre Polymarket, Kalshi, Manifold, Hyperliquid e o
ecossistema de previsão como um todo.

> 📌 Ponto de partida recomendado: comece por esta lista para descobrir outras ferramentas
> além das 11 acima. Pull requests são bem-vindos.

---

## 🔗 Tabela-resumo (links rápidos)

| # | Ferramenta | Categoria | Link |
|---|-----------|-----------|------|
| 1 | Polymarket Data | Dados | https://github.com/SII-WANGZJ/Polymarket_data |
| 2 | Prediction Market Backtesting | Backtesting | https://github.com/evan-kolberg/prediction-market-backtesting |
| 3 | Polybot | Análise de traders | https://github.com/ent0n29/polybot |
| 4 | Bot de liquidez | Liquidez | https://github.com/lihanyu81 ⚠️ |
| 5 | PolyWeather | Clima | https://github.com/yangyuan-zhen/PolyWeather |
| 6 | CloddsBot | Multi-estratégia | https://github.com/alsk1992/CloddsBot |
| 7 | Pydantic AI | Agentes de IA | https://github.com/pydantic/pydantic-ai |
| 8 | TradingAgents | Dashboard multi-agente | https://github.com/TauricResearch/TradingAgents |
| 9 | PMXT | API unificada | https://github.com/pmxt-dev/pmxt |
| 10 | Toolkit multi-estratégia | Bots | https://github.com/HarrierOnChain ⚠️ |
| 11 | Awesome Prediction Market Tools | Lista | https://github.com/aarora4/Awesome-Prediction-Market-Tools |

> ⚠️ = link com nome de repositório não confirmado (handle preservado da thread original).

---

_Documento traduzido e adaptado para o português. Fonte original: thread de_
_[@recogard](https://x.com/recogard/status/2062985176880230809)._
