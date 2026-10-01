# BondWatch Data Ingest Map

## Principle

BondWatch has two lanes:

1. **Hot path** — chain-native launch, curve, graduation, pool, and liquidity events. This is the only source allowed to prove `BONDED`.
2. **Enrichment path** — market data, ticker data, RSS/news, filings, macro, social metadata, wallet intelligence, and external screeners. These sources can improve scoring and prioritization but must never replace on-chain graduation proof.

This separation protects alert latency and prevents a slow or incorrect third-party feed from corrupting the core lifecycle state machine.

## Existing Agentropolis financial OSINT layer

`AGENTROPOLIS-FIN54` is already the canonical open-data financial reconnaissance service and should be reused rather than duplicated.

Current FIN54 sources include:

- SEC EDGAR
- FRED
- Yahoo Finance quotes / OHLCV
- Yahoo Finance RSS
- Reuters / MarketWatch RSS
- FINRA OTC public summaries
- optional Alpha Vantage free-key fallback

FIN54 already exposes market, macro, filings, news/sentiment, and synthesized report surfaces. BondWatch should consume these capabilities through an adapter instead of embedding duplicate provider clients.

## External open-source candidates

Evaluate before vendoring. Prefer adapters or MCP federation over copying implementations.

### Market / ticker MCP

- `danchev/openmarkets` — Yahoo Finance MCP for history, dividends, splits, company information, and metrics.
- `keisku/yfinance-mcp` — MIT; Yahoo Finance MCP with technical indicators.
- `CohenD/fin-data-mcp` — broad no-key financial data MCP across equities, indices, options, FX, crypto, commodities, macro, filings, sentiment, and congressional trading. Verify license before vendoring.
- `theianchia/markets-mcp` — Go MCP using Yahoo public chart data with server-side VWAP/SMA/volatility aggregation.
- `stockmcp/stock-data-mcp` — MIT; stocks plus OKX crypto market tools.

### Crypto / on-chain market MCP

- `openSVM/dexscreener-mcp-server` — DexScreener market data MCP; useful as post-launch price/liquidity enrichment.
- `junct-bot/coingecko-mcp` — hosted no-auth CoinGecko MCP surface; repository is public, but hosted availability and upstream rate limits remain external dependencies.
- `leosrdev/crypto-mcp-server` — MIT; CoinGecko crypto-price MCP implemented with Spring AI.
- `BugMentor/mcp-crypto` — CoinGecko-backed price/watchlist MCP.

### Filings / regulatory OSINT

- `cotrane/mcp-edgar-sec` — SEC EDGAR MCP built on edgartools.
- `asp53826/edgar-mcp` — MIT; EDGAR filings, XBRL facts, caching and rate-limit evidence.
- `openpharma-org/sec-mcp` — SEC EDGAR / XBRL MCP.
- `birthday-tools/edgarmcp` — EDGAR + insider trades + FRED + OpenFIGI + quote feed.
- `iabraham23/finviz-sec-mcp` — free Finviz + SEC research MCP.

### RSS / news ingestion

- `MissionSquad/mcp-rss` — RSS/Atom MCP with batch fetch, monitoring, search and OPML export.
- `richardwooding/feed-mcp` — RSS, Atom and JSON Feed MCP.
- `furkankoykiran/OmniWire-MCP` — MIT; RSS/Atom/JSON/HTML aggregation with circuit breakers.
- `GaryRogers/rss-reader-mcp` — lightweight RSS/Atom fetch/search MCP.
- `odysseus0/feed` — headless agent-focused RSS engine with auto-discovery, SQLite FTS5, ETag/If-Modified-Since, JSON output and an agent skill.
- `huawolf/news-agent` — RSS/news collection, scoring, dedupe, local API and stdio MCP.
- `ayoubbuoya/buoya-news-agent` — Rust local crypto/AI news ingestion with RSS, CoinGecko, DeFiLlama, SQLite and semantic search; MCP endpoint noted as roadmap at time of review.

### Agent / trading research kits

- `TauricResearch/TradingAgents` and maintained forks — open-source multi-agent market research/risk/trader architecture. Use as an architectural reference, not an execution authority.
- `aminakhshi/financial_agent` — multi-agent market analysis with deterministic ingestion, anomaly detection and prediction layers.
- `Blahaj-gif/Finance-mcp` — read-heavy finance MCP with broker integrations and a separate human-only execution path; useful reference for keeping research authority separate from order authority.

## Recommended Agentropolis composition

```text
CHAIN / LAUNCHPAD EVENTS -----------------------------> BondWatch Hot Path
  TokenCreated -> Curve -> Graduation -> Pool
                         |
                         +--> VERIFIED BONDED

FIN54 ------------------------------------------------> Market Enricher
  Yahoo / SEC / FRED / FINRA / RSS

DexScreener / CoinGecko ------------------------------> Crypto Enricher

RSS MCP / feed engine --------------------------------> News Enricher

Wallet / holder / contract security ------------------> Risk Enricher

All enrichment ---------------------------------------> Score + Alert Packet
                                                        |
                                                        +--> EXECUTION_PROPOSAL
                                                             (separate authority)
```

## Integration order

1. Finish live Pons V2 hot-path adapter and backfill cursor.
2. Add a `FIN54Enricher` contract to BondWatch.
3. Add DexScreener/CoinGecko enrichment for post-graduation liquidity, volume and pair metadata.
4. Add RSS/Atom/JSON Feed ingestion through a reusable feed adapter; do not hard-wire news vendors into BondWatch core.
5. Add persistent feed/ticker cache with source timestamps and provenance.
6. Add holder/wallet concentration and contract-risk enrichment.
7. Emit one normalized `MARKET_INTELLIGENCE_PACKET` alongside the canonical `TOKEN_BONDED` event.

## Data contract

Every enrichment field should carry provenance:

```json
{
  "field": "volume_5m",
  "value": 12345,
  "source": "dexscreener",
  "source_timestamp": "...",
  "observed_at": "...",
  "confidence": 0.0,
  "stale_after_seconds": 30
}
```

No data source is silently promoted to truth. Freshness, provenance and confidence stay attached through scoring and alerting.
