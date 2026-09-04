# GENESIS-SPAWN Cross-Repo Integration Matrix

| Source | Existing capability | GENESIS-SPAWN role | Authority boundary | Status |
|---|---|---|---|---|
| `wiredchaos/CBE-CLEARtv-CHAOSbot-dYad` | CHAOSbot console, Guardian Prime, wallet UI, region context, risk/circuit-breaker UX, CBE/CLEARtv/dYad bridge | operator console + candidate/risk explanation + campaign/control surface | no autonomous signing; live financial actions require confirmation | incorporate |
| `wiredchaos/choasbotforge` | bot builder agents, community manager, automation builder, tokenomics advisor, marketplace, quests, rewards, game economy | SPAWN builder funnel + reusable bot/agent templates + community/economy scaffolding | tokenomics advice is design assistance, not trading authority | incorporate |
| `wiredchaos/choasbotforge/docs/MARKETSCANNER_ARCHITECTURE.md` | unified financial/regulatory/agent/commerce ingestion | signal ingress for ADOPT/ARRIVAL risk + GTM intelligence | read/normalize/score; no execution authority | incorporate |
| `wiredchaos/neuralis` | agents/characters, districts, skills, portfolios, worlds, storefront/commerce concepts | persistent identity projection, portfolio, district/world placement after verification | presentation/reputation projection cannot grant runtime authority | incorporate |
| `AGENTROPOLIS-CITY-OF-AGENTS/agentropolis` | Opportunity Grid, CBE contract, provider registry, Virtuals ACP, human approval, FISCAL CMD routing | canonical market/work and external-provider architecture | provider adapters cannot bypass human/identity/financial gates | canonical |
| `wiredchaos/agentropolisworldgrid` | Base MCP / finance-claw / Virtuals discovery scaffolding | external agent discovery + future settlement adapter | read-only discovery; confirmed financial proposals only | incorporate |
| `AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-GTM` | campaigns, agent GTM, public/private strategy surfaces | AgentPump distribution and acquisition | policy-compliant promotion; no coordinated trading | canonical GTM |
| `wiredchaos/AGENTROPOLIS-MRKT-CMD` | $OSCAR case study, threat model, policy, GENESIS-SPAWN specs | private integration staging + market/risk command layer | fail closed | current staging |

## Canonical flow

```text
MarketScanner / AGENTSCAN / RAILWATCH
              |
              v
       normalized evidence
              |
              v
       GENESIS-SPAWN gate
      /        |        \
   SPAWN      ADOPT     ARRIVAL
      \        |        /
              v
        Guardian / AEGIS
              |
              v
          CHAOSbot
              |
              v
             CBE
       mission / service
              |
      independent verifier
              |
       Sentinel-6 receipt
              |
              v
          Neuralis
   portfolio / district / world
              |
              v
       graduation review
              |
              v
       Agentropolis citizen
```

## Financial-control rule

The legacy CHAOSbot financial surface is reused as a governed proposal/inspection layer, not as an autonomous market actor.

Financial capability classes:

- `OBSERVE`: portfolio, balance, market/risk data, wallet graph, liquidity/authority status
- `PROPOSE`: prepare swap/payment/settlement proposal
- `APPROVE`: human/policy authority grants permission
- `SIGN`: dedicated wallet/user authority only
- `VERIFY`: independent verifier records outcome

No role may collapse `PROMOTE + SIGN + VERIFY` into a single autonomous principal.

## Legacy OCN note

A canonical source artifact explicitly named `financial OCN` has not yet been located in indexed repositories. Do not invent its meaning. Terminal audit should search repository history, non-default branches, docs, issues, commits, and local/unindexed repos for:

- `OCN`
- `financial OCN`
- `Chaos Bot OCN`
- `CHAOSbot financial`
- `financial network`
- likely acronym expansions used in historical project notes

When found, classify each primitive into OBSERVE / PROPOSE / APPROVE / SIGN / VERIFY before wiring it into GENESIS-SPAWN.
