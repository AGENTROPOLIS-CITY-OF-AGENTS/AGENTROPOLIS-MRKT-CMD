# BondWatch

Real-time token lifecycle intelligence for AGENTROPOLIS Market Command.

## Objective
Detect newly created launchpad tokens, follow bonding/graduation state, and emit a verified `TOKEN_BONDED` signal as soon as destination liquidity is observed on-chain.

BondWatch is an intelligence agent. It does not custody keys and does not execute autonomous buys.

## State machine

```text
WATCH -> HEATING -> IMMINENT -> BONDED
  |         |           |
  +---------+-----------+-> REJECT
```

### WATCH
Token creation observed.

### HEATING
Curve progress or transaction velocity crosses configured thresholds.

### IMMINENT
Graduation is close enough to warrant priority monitoring.

### BONDED
Destination liquidity creation has been independently observed on-chain.

### REJECT
Hard risk condition, spoof, honeypot, or other disqualifying signal.

## Current v0.1 components

- shared lifecycle types
- adapter contract
- lifecycle state machine
- conservative risk scorer
- event deduplication
- in-memory lifecycle store
- transition receipts
- BONDED event generator
- console sink
- manual adapter for fixtures/integration testing

## Live adapter rule

Launchpad semantics must live behind adapters. Core BondWatch code must not assume a specific launchpad, chain, bonding curve, DEX, or graduation mechanism.

Every live adapter must independently map its native events to:

```ts
TOKEN_CREATED
CURVE_UPDATE
GRADUATION_HINT
LIQUIDITY_CREATED
REJECT
```

The `LIQUIDITY_CREATED` mapping is the canonical BONDED proof. A launchpad front-end label alone is not sufficient.

## Adapter priority

1. The launchpad used by the Pons ecosystem shown in current research.
2. Solana bonding-curve launchpads used for rapid token launches.
3. Base / EVM agent-token launch systems.
4. Virtuals-style agent launch ecosystems.
5. Additional factories through the same normalized contract.

Each adapter should use chain-native WebSocket/RPC subscriptions where available and implement reconnect plus historical backfill.

## Immediate signal payload

```json
{
  "event": "TOKEN_BONDED",
  "chain": "...",
  "launchpad": "...",
  "token": "...",
  "creator": "...",
  "createdAt": "...",
  "bondedAt": "...",
  "bondTimeSeconds": 0,
  "liquidityVenue": "...",
  "pool": "...",
  "liquidityUsd": 0,
  "holders": 0,
  "uniqueBuyers": 0,
  "creatorConcentration": 0,
  "top10Concentration": 0,
  "riskScore": 0,
  "qualityScore": 0,
  "confidence": 0,
  "receiptId": "..."
}
```

## Execution handoff

A BONDED event may create an `EXECUTION_PROPOSAL` for a separately governed execution service. That service must enforce its own wallet authority, max position size, liquidity minimum, slippage ceiling, deny lists, loss controls, simulation, and post-trade receipt.

Detection latency and capital authority remain separate concerns.

## Next implementation slice

- add persistent storage
- add reconnect/backfill cursor
- add WebSocket/RPC adapter for first verified launchpad contract
- add holder/concentration enrichment
- add pool-liquidity verification
- add Slack/Telegram/Webhook alert sink
- add Prometheus-style latency metrics
- add tests for dedupe, transitions, reconnect, and BONDED verification

## North-star latency metric

```text
bond_alert_latency_ms = alert_emitted_at - bonded_chain_confirmation_at
```

Measure separately from front-end discovery latency. The chain event is the source of truth.
