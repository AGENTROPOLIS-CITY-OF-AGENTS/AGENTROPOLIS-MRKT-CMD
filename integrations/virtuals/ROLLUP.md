# Virtuals Rollup for AGENTROPOLIS GENESIS

## What already exists

### Repo 1 — `AGENTROPOLIS-CITY-OF-AGENTS/agentropolis`

Canonical opportunity/provider architecture already treats Virtuals as a first-class agent-service market.

Relevant code/docs:

- `registry/opportunities/providers.v1.json`
  - provider id: `virtuals-acp`
  - class: `agent_service_market`
  - status: `native`
  - settlement: `protocol_specific`
  - protected by human approval for wallet/contract actions, Hermes Vault secret storage, FISCAL CMD recording, identity gate, and risk gate.
- `docs/AGENTROPOLIS_OPPORTUNITY_GRID.md`
  - lists Virtuals Agent Commerce Protocol in agent-service and machine-commerce markets.
  - routes provider adapters -> Opportunity Grid -> CBE -> CHAOS Rank -> HERMES -> districts -> Verifier -> human approval -> FISCAL CMD -> reputation/citizenship.

### Repo 2 — `wiredchaos/agentropolisworldgrid`

Virtuals already appears in executable/simulated finance-claw surfaces.

Relevant code:

- `supabase/functions/finance-claw/index.ts`
  - `agent` skill routes to plugin `virtuals`
  - MCP method `discover_agents`
  - marked read-only / no confirmation required
  - financial actions remain confirmation-gated
  - current implementation returns simulated proposals rather than live chain execution.
- `src/pages/BaseMCP.tsx`
  - Virtuals is one of the seven Base MCP skill plugins.
  - agent discovery is exposed as read-only.
  - architecture declares user-only transaction signing, no private-key access, local transaction construction, NEMOclaw credential mitigation, and audit logging.

### Additional duplicated/adjacent surfaces

- `wiredchaos/AGENTROPOLIS-NEXUS54/src/BaseMCPIntegration.tsx` mirrors the Base MCP + Virtuals discovery architecture.
- `wiredchaos/schoolofbase/src/data/tickerSpine.ts` has a dedicated `VIRTUALS` source in the Agent Economy radar and tracks ACP, agent funding, wallet flows, and related ecosystem signals.
- `wiredchaos/schoolofbase` also presents citizen tiers spanning Base + Virtuals ACP.

## Rollup decision

Do NOT build another disconnected Virtuals integration.

AGENTROPOLIS GENESIS will consume these existing primitives as one bounded adapter:

`Virtuals ACP -> Foreign Agent Adapter -> Identity/Provenance Gate -> AEGIS -> GENESIS -> CBE/Opportunity Grid -> HERMES -> Sentinel-6 Receipt`

## GENESIS responsibilities

GENESIS adds the missing lifecycle above the existing Virtuals rails:

- launch class: GENESIS / ADOPT / AWAKEN
- zero-trust inbound agent quarantine
- provenance and wallet graphing
- tokenless launch option
- token-adoption/CTO path
- utility-based graduation
- independent reputation and receipts
- separation of promotion, treasury, trading, and verification roles
- portable identity across external ecosystems

## Rule

Virtuals is a peer ecosystem and integration target, not a dependency.

A Virtuals outage, policy change, API change, token issue, or compromised external agent must not disable AGENTROPOLIS GENESIS.
