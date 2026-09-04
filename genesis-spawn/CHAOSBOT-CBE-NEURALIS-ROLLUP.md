# GENESIS-SPAWN Rollup: CHAOSbot + CBE + Neuralis

## Goal

Fold the existing CHAOSbot / CBE / Neuralis financial, intelligence, marketplace, bot-building, risk, wallet, and media primitives into GENESIS-SPAWN rather than reimplementing them.

## Source systems incorporated

### `wiredchaos/CBE-CLEARtv-CHAOSbot-dYad`

Existing useful primitives:

- CHAOSbot command surface with `/balance`, `/swap`, `/risk`, `/guardian`, `/scan`, region switching, and trench-room entry.
- Guardian Prime risk engine and armed circuit-breaker concept.
- Explicit requirement for approval before live trades.
- Omni Wallet / CHAOS WALLET UI surfaces.
- Swarm-control and dashboard surfaces.
- NEURA Agentropolis Bridge connecting CBE, CLEARtv, CHAOSbot, and dYad.
- RAILWATCH trust/treasury OSINT.
- AGENTSCAN ecosystem intelligence.
- NEURA Geo-Finance RWA/geospatial finance intelligence.
- MarketScanner cross-market/infrastructure signals.
- content routing to CBE, CHAOSbot, CLEARtv, dYad, and social outputs.

### `wiredchaos/choasbotforge`

Existing useful primitives:

- Bot creation entities and setup assistants.
- Automation builder.
- Community manager.
- Forge architect.
- Strategy advisor.
- Tokenomics advisor.
- Web3 educator.
- Marketplace item/listing entities.
- Quest/reward systems.
- TokenReward and TokenTransaction entities.
- GameEconomy, GameProgress, CrossGameProgress, Leaderboard, Duel, and GameMatch entities.
- MarketScanner architecture covering stocks, ETFs, options, crypto, stablecoins, RWAs, payment rails, banking, AI-agent ecosystems, GitHub, and regulation.

### `wiredchaos/neuralis`

Existing useful primitives:

- agent/character registry concepts;
- skills and district entities;
- world/scene/story/shot registries;
- portfolios and case-study records;
- subscriptions;
- NeuraMall virtual commerce hub;
- multi-world/patch registry concepts;
- Neuralis RWA and financial-intelligence positioning.

## Canonical GENESIS-SPAWN mapping

```text
MarketScanner / RAILWATCH / AGENTSCAN / Neuralis
                    |
                    v
              SIGNAL INGEST
                    |
             CHAOS RISK GATE
      Guardian Prime + AEGIS + Sentinel-6
                    |
       +------------+-------------+
       |                          |
       v                          v
GENESIS-SPAWN                CBE ECONOMY
SPAWN / ADOPT / ARRIVAL      jobs / services / listings
       |                          |
       v                          v
CHAOSBOT OPERATOR <-------> BOT/AGENT MARKETPLACE
       |
       +--> skills / automations / community / quests
       +--> optional economics / rewards
       +--> games / cross-game progression
       +--> Neuralis worlds / districts / portfolio
       |
       v
    RECEIPTS
       |
       v
GRADUATION / CITIZENSHIP
```

## Financial OCN roll-forward

The exact historical `OCN` acronym was not located as a canonical file/repository name during this pass, so GENESIS-SPAWN must **not invent its expansion**.

What is clearly present and is being rolled forward is the financial operating pattern associated with CHAOSbot/CBE:

- wallet/balance surface;
- guarded swap proposals;
- risk scoring;
- circuit breakers;
- human approval for live trades;
- treasury intelligence via RAILWATCH;
- cross-market scanning;
- settlement/commerce surfaces;
- token rewards and transaction records;
- regional market awareness.

Until the original OCN artifact is found, refer to this internal capability as `LEGACY_FINANCIAL_OCN` and preserve the name as an unresolved alias rather than guessing.

## Authority separation

The historical CHAOSbot UI exposes trading concepts. GENESIS-SPAWN tightens the model:

- `CHAOSBOT_OPERATOR` may read balances, scan, explain, simulate, and prepare proposals.
- `GUARDIAN_PRIME` / AEGIS decides whether a proposal is admissible.
- `TREASURY_EXECUTOR` is separate and human-confirmed for material actions.
- `PROMOTION_AGENTS` cannot invoke trading actions.
- `VERIFIER` cannot be the actor whose action it verifies.
- `MARKETSCANNER` remains read-only ingestion.

For ADOPT cases such as $OSCAR, autonomous buy/sell authority remains disabled.

## BotForge -> GENESIS-SPAWN

`choasbotforge` becomes a feeder/build surface for SPAWN.

Mapping:

- Bot -> Agent Manifest
- Bot Setup Assistant -> SPAWN onboarding
- Forge Architect -> agent architecture generator
- Automation Builder -> skill/workflow builder
- Community Manager -> AgentPump community role
- Strategy Advisor -> GTM/mission planner
- Tokenomics Advisor -> optional economics design, policy-gated
- TokenReward -> contribution reward record
- TokenTransaction -> normalized financial receipt reference
- MarketplaceListing -> CBE service/agent listing
- Quest -> governed growth/community mission
- GameEconomy -> optional game-agent economy module

Tokenomics guidance is advisory only. Deployment, treasury actions, staking, airdrops, and other material financial operations require separate policy and human approval.

## Neuralis -> GENESIS-SPAWN

Neuralis becomes the world/identity/portfolio enrichment layer:

- `World` / patch registries -> destination world/district metadata
- `District` -> citizenship placement
- `Skill` -> Agent Manifest capability declarations
- `Portfolio` -> verified proof-of-work portfolio
- `Subscription` -> recurring service/economic relationship
- NeuraMall -> commerce destination / agent storefront
- characters/agents -> persona and public-facing identity surfaces

The canonical trust record remains GENESIS-SPAWN identity + Sentinel-6 receipts, not self-declared Neuralis metadata.

## CBE -> GENESIS-SPAWN

CBE is the economic work market.

After SPAWN/ARRIVAL/ADOPT quarantine, agents may:

1. list capabilities;
2. discover jobs/services;
3. accept governed work orders;
4. produce evidence;
5. settle through approved rails;
6. earn portable reputation;
7. use verified work toward graduation.

No raw wallet keys, platform secrets, or proprietary risk weights move into listings.

## MarketScanner reuse

One scanner, many outputs remains canonical.

GENESIS-SPAWN consumes normalized signals for:

- external agent ecosystem changes;
- token/contract risk;
- stablecoins/payment rails;
- RWA and treasury intelligence;
- regulatory changes;
- GitHub ecosystem changes;
- partner/competitor discovery;
- launch/adoption risk scoring.

Signal data may inform risk and strategy but does not directly authorize execution.

## Required next implementation work

1. Find and inspect the original `OCN` artifact/commit if it exists under another historical name.
2. Define a normalized `ChaosFinancialProposal` schema.
3. Adapt CHAOSbot commands to HERMES/NEMOclaw/Base MCP proposal flows.
4. Map BotForge entities into the GENESIS-SPAWN Agent Manifest and CBE records.
5. Convert Guardian Prime concepts into explicit AEGIS policy rules and circuit-breaker events.
6. Add RAILWATCH/AGENTSCAN/MarketScanner adapters as read-only signal providers.
7. Add Neuralis portfolio/world metadata as optional enrichment, never authority.
8. Add Sentinel-6 receipts for every financial proposal, denial, execution, and rollback.
