# GENESIS-SPAWN Implementation Checklist

## Chat-complete architecture

The following architecture is already staged on this branch:

- $OSCAR ADOPT case study
- scam-aware threat model
- fail-closed policy
- Virtuals rollup
- foreign-agent gate
- GENESIS-SPAWN architecture
- agent manifest schema
- graduation model
- ARRIVAL adapter contract
- receipt specification
- CHAOSbot / CBE / Neuralis rollup

## Terminal implementation order

### P0 — Safety boundary first

- [ ] implement AEGIS runtime policy evaluator from `case-studies/oscar/policy.yaml`
- [ ] enforce no-trade/no-sign/no-transfer permissions for growth/community agents
- [ ] separate social credentials from treasury/admin credentials
- [ ] add global HALT state and emergency credential revocation hooks
- [ ] add immutable/externally anchored Sentinel-6 receipt persistence
- [ ] add denial receipts for blocked/failed/not-dispatched actions

### P0 — Identity and lifecycle

- [ ] implement agent-manifest validation
- [ ] persist lifecycle state: SPAWN / ADOPT / ARRIVAL / GRADUATE
- [ ] add origin ecosystem + provenance fields
- [ ] add authority-set collision checks
- [ ] reject agents that combine promotion + unrestricted trading + self-verification authority

### P0 — $OSCAR forensic adapter

- [ ] verify candidate mint against two independent chain sources
- [ ] ingest deployer balance and disposal history
- [ ] enumerate top holders
- [ ] identify launch-bundle wallets where possible
- [ ] common-funder graph
- [ ] authority state verification
- [ ] liquidity state verification
- [ ] creator/brand affiliation state: VERIFIED / UNVERIFIED / DENIED
- [ ] emit one signed/anchored risk receipt per scan

### P1 — MarketScanner / intelligence ingress

- [ ] adapter for MarketScanner normalized signals
- [ ] route AGENTSCAN signals to ARRIVAL candidates
- [ ] route RAILWATCH/financial signals to risk context only
- [ ] preserve `research once, distribute everywhere` pattern
- [ ] source snapshot hashes on all externally derived claims

### P1 — CHAOSbot command surface

Implement governed GENESIS-SPAWN commands:

- [ ] `/spawn`
- [ ] `/adopt <asset|community|agent>`
- [ ] `/arrival <origin> <agent>`
- [ ] `/genesis-risk <id>`
- [ ] `/graduation <id>`
- [ ] `/receipt <id>`
- [ ] `/cbe <id>`
- [ ] `/halt <id>` — human/admin only

Existing financial-style commands must remain confirmation-gated. CHAOSbot may prepare proposals but may not autonomously sign material financial actions.

### P1 — CBE activation

- [ ] create GENESIS-SPAWN candidate profile in CBE
- [ ] match new agents to sandbox missions
- [ ] generate work order
- [ ] verifier reviews deliverable independently
- [ ] emit receipt
- [ ] post reputation event
- [ ] calculate time-to-first-verified-mission

### P1 — Neuralis projection

- [ ] map agent manifest to Neuralis character/entity profile
- [ ] map verified missions into portfolio/case-study records
- [ ] map district placement
- [ ] optional world/storefront projection
- [ ] do not treat Neuralis presentation state as authority state

### P2 — External ecosystem adapters

- [ ] Virtuals ARRIVAL adapter
- [ ] Olas adapter
- [ ] Hermes adapter
- [ ] MCP/A2A generic adapter
- [ ] x402 service/settlement adapter

All external ecosystems are peers/feeders; GENESIS-SPAWN must fail gracefully when any single provider is unavailable.

### P2 — AgentPump GTM telemetry

- [ ] impressions
- [ ] legitimate unique participants
- [ ] qualified inbound builders/agents
- [ ] time to first CBE receipt
- [ ] repeat mission rate
- [ ] creator/community collaboration events
- [ ] policy pass/fail rate
- [ ] graduation progression

Do not optimize token price, market cap, or coordinated trading volume.

## Integration test scenarios

1. Clean tokenless SPAWN agent completes one CBE sandbox mission and receives independent receipt.
2. Virtuals ARRIVAL agent keeps origin identity and gains Agentropolis reputation without migrating economics.
3. $OSCAR ADOPT remains quarantined while wallet provenance is unresolved.
4. External agent requests token trade from a growth agent -> denied + denial receipt.
5. Promoter requests self-verification -> denied due to authority collision.
6. Suspicious deployer-linked wallet movement -> ADOPT state transitions to HALT/QUARANTINED.
7. Virtuals/API outage -> native GENESIS-SPAWN + CBE remain functional.
8. Compromised social credential -> revoke publishing scope without affecting treasury/admin systems.

## Definition of alpha-ready

Alpha is ready when:

- all P0 items pass automated tests;
- one SPAWN, one ARRIVAL, and one ADOPT path can be demonstrated end-to-end;
- every state transition produces a receipt;
- no autonomous growth agent can sign or trade;
- verifier is independent of the actor;
- HALT works in integration tests;
- CBE can produce first verified mission proof;
- Neuralis can project proof without becoming a source of authority.
