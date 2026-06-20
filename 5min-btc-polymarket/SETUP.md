# Setup — 5min BTC Polymarket

Installation and configuration guide for the `btc-5m-live` skill
(cloned from https://github.com/Novals83/5min-btc-polymarket).

## 1. Install Python dependencies

```bash
cd 5min-btc-polymarket
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

Dependencies (see `requirements.txt`):
- `requests` — Polymarket Gamma API (market resolution)
- `py-clob-client` — Polymarket CLOB client (orderbooks, auth, order status)

Verify the install:

```bash
.venv/bin/python -c "import requests; from py_clob_client.client import ClobClient; print('OK')"
.venv/bin/python scripts/test_btc_5m_session_exit_sl.py --help
```

## 2. Configure credentials

```bash
cp .env.example .env
# edit .env and fill in PM_PRIVATE_KEY / PM_API_KEY / PM_API_SECRET / PM_API_PASSPHRASE
```

The real `.env` is gitignored and must never be committed.

## 3. External execution engine (required for live trading)

Order placement/close is **delegated** to an external repo
(`pm-hl-conservative-plus-repo`, `src/live/pm_live_trade_runner.py`) that is
**not** included here. Point the skill at it via `BTC5M_REPO`:

```bash
export BTC5M_REPO=/abs/path/to/pm-hl-conservative-plus-repo
```

Without it, only market resolution / orderbook reads work; `--execute`
(open/close) cannot run. See `CONTOUR.md` for the full dependency boundary.

## 4. Run

Dry-run (safe, no orders):

```bash
.venv/bin/python scripts/test_btc_5m_session_exit_sl.py --profile conservative
```

Live (requires steps 2 + 3):

```bash
.venv/bin/python scripts/test_btc_5m_session_exit_sl.py --profile conservative --execute
```

Unified control:

```bash
scripts/btc5m_ctl.sh start --profile conservative
scripts/btc5m_ctl.sh status
scripts/btc5m_ctl.sh report --limit 20
scripts/btc5m_ctl.sh stop
```

## Network requirements

The skill calls these hosts at runtime — they must be reachable / allowlisted:

- `https://gamma-api.polymarket.com` — market resolution
- `https://clob.polymarket.com` — CLOB orderbooks & auth

> Note: in restricted/sandboxed environments (e.g. Claude Code on the web with
> a network egress allowlist), these hosts return `403 Host not in allowlist`.
> Add them to the environment's egress settings before running against live
> markets. Dependency installation and configuration do not require them.

## Risk notice

Educational/operational infrastructure, not financial advice. Always run in
dry-run first, set daily loss caps and per-trade notional limits, and start
with small stake sizing. See `README.md` → Risk Controls Template.
