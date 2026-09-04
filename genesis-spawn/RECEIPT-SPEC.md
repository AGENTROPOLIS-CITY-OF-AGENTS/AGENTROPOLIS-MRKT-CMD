# GENESIS-SPAWN Receipt Specification

Every consequential GENESIS-SPAWN action emits an inspectable receipt.

## Receipt envelope

```json
{
  "receipt_version": "1.0.0",
  "receipt_id": "uuid",
  "agent_id": "agent-id",
  "entry_path": "SPAWN|ADOPT|ARRIVAL",
  "mandate_id": "mandate-id",
  "action": "bounded action name",
  "authority_snapshot_hash": "sha256",
  "policy_snapshot_hash": "sha256",
  "before_state_hash": "sha256",
  "after_state_hash": "sha256",
  "evidence": [],
  "verifier": {
    "id": "verifier-id",
    "independent_of_actor": true
  },
  "decision": "VERIFIED|FAILED|DENIED|INCONCLUSIVE",
  "risk_state": "GREEN|YELLOW|ORANGE|RED|HALT",
  "timestamp": "ISO-8601"
}
```

## Independent verification rule

The actor cannot be the sole verifier of its own consequential action.

A receipt must identify independent evidence or an independent verifier boundary.

## Denial receipts

A denied action must not be represented merely by the absence of a state change.

A denial receipt records:

- request received
- dispatch attempted or blocked-before-dispatch
- policy rule that denied authority
- expected target
- before-state evidence
- after-state evidence where applicable
- explicit `DENIED` decision

This distinguishes:

- correctly denied
- dispatched but failed
- never dispatched
- silently failed

## Tamper resistance

Production implementation should anchor receipt hashes outside the actor's writable boundary. Sentinel-6 may aggregate receipts, but an actor must not be able to rewrite the only surviving copy of its own audit history.
