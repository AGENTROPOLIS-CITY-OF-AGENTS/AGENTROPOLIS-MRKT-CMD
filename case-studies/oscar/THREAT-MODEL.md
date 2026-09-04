# $OSCAR Threat Model — Assume Compromise Until Proven Otherwise

## Operating assumption

Treat the existing $OSCAR token, deployer, large holders, public links, and any claimed creator affiliation as potentially malicious or misleading until independently verified.

The Agentropolis objective is to preserve the ability to run the social/community experiment while preventing loss of funds, credential compromise, reputational capture, or accidental promotion of a scam.

## Trust zones

### Zone 0 — Untrusted

- Existing $OSCAR token contract and all external token metadata
- Original deployer and associated wallets
- Large holders and bundled-launch wallets
- Pump.fun comments, DMs, Telegram/Discord invites, shortened URLs, airdrops, and wallet-signature requests
- Any site claiming to be an official Oscar or $OSCAR portal unless independently verified

No secrets, treasury keys, signing authority, or production credentials may cross into Zone 0.

### Zone 1 — Observation only

Agents may:

- read public chain data;
- read public social activity;
- collect market telemetry;
- build wallet relationship graphs;
- archive evidence;
- score risk.

Agents may NOT sign transactions, connect treasury wallets, or execute token trades.

### Zone 2 — Governed social operations

Agents may publish approved content, run community programming, perform creator outreach, and measure engagement only through scoped platform credentials.

Every action requires:

`IDENTITY -> MANDATE -> POLICY -> EXECUTION -> RECEIPT`

### Zone 3 — Treasury / sensitive systems

Treasury, private keys, infrastructure secrets, production deploy keys, and owner accounts are completely isolated from $OSCAR-facing agents.

No autonomous agent receives unrestricted treasury signing authority.

## Failure scenarios

### Rug / insider dump

Trigger indicators:

- deployer-linked wallet begins transferring or selling material supply;
- clustered launch wallets move simultaneously;
- liquidity changes unexpectedly;
- holder concentration rises sharply;
- new evidence links large holders to deployer funding.

Response:

1. Stop token-specific promotional content.
2. Preserve chain snapshots and receipts.
3. Publish no speculative explanation.
4. Mark experiment `QUARANTINED`.
5. Continue culture/community activity only if it can be clearly separated from token promotion.

### Fake creator affiliation

If the Oscar creator/brand relationship cannot be proven:

- never use `official`, `partner`, `endorsed`, `creator-backed`, or equivalent language;
- describe the token as an independently launched token using the Oscar meme/theme;
- do not copy protected brand assets into commercial claims without permission;
- seek direct creator authorization before any official campaign framing.

### Wallet drain / malicious signature

Agents and operators must never:

- sign arbitrary messages from token-related websites;
- approve unlimited token allowances;
- import seed phrases into bots;
- connect the treasury wallet to Pump.fun clones, unofficial explorers, or community links;
- install browser extensions suggested by token participants.

Use a disposable observation wallet with no valuable assets if wallet connectivity is ever required for read-only testing.

### Social capture / manufactured consensus

Reject:

- paid shills without disclosure;
- coordinated voting or brigading;
- fake users or fake testimonials;
- bots pretending to be independent humans;
- fabricated holder numbers or community metrics;
- coordinated buy windows or price/mcap targets.

## Kill switches

Set experiment state to `HALT` when any of the following occurs:

- verified malicious contract or wallet behavior;
- unexplained deployer-linked supply movement above the configured threshold;
- loss or suspected compromise of any social/API credential;
- false creator-affiliation claim is published;
- an agent attempts a prohibited trade or wallet-signing action;
- platform enforcement action indicates the swarm is violating anti-spam/coordination rules;
- AEGIS risk score reaches CRITICAL.

HALT effects:

- disable publishing automation;
- revoke agent platform tokens;
- block all $OSCAR contract-address output;
- prevent treasury actions;
- snapshot logs and wallet telemetry;
- require explicit human re-authorization.

## Containment architecture

```text
UNTRUSTED TOKEN / SOCIAL INPUTS
            |
      READ-ONLY INGEST
            |
     VERIFICATION AGENT
            |
          AEGIS
       /         \
   REJECT       ALLOW
                  |
           SOCIAL EXECUTION
                  |
             RECEIPT

TREASURY / KEYS / ADMIN
        X  NO PATH  X
          TO TOKEN
```

## Minimum verification before token-specific activation

The token-specific campaign remains `YELLOW` until all are complete:

- full mint verified from at least two independent chain sources;
- deployer wallet identified;
- deployer token balance and disposal history traced;
- top holders enumerated;
- launch-bundle wallets identified where possible;
- common-funder relationships checked;
- current mint/freeze authorities verified on-chain;
- liquidity state checked;
- creator/brand affiliation classified as VERIFIED / UNVERIFIED / DENIED;
- no privileged Agentropolis wallet has interacted with the token.

## Green-light rule

`GREEN` does not mean the token is safe or a good investment.

It means only that available evidence is sufficient to permit a governed community experiment under strict separation from trading and custody.

## Public language while status is YELLOW

Approved:

- `We are researching an independently launched $OSCAR token as an Agentropolis community experiment.`
- `Agentropolis does not control the token contract or its original deployer.`
- `Agents coordinate content and community activity, not trading.`

Forbidden:

- `our token`;
- `official Oscar token`;
- `safe`;
- `rug-proof`;
- `dev is out` unless conclusively verified and timestamped;
- investment-return claims.
