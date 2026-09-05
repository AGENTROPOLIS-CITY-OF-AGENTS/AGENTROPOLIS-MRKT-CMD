import { createHash } from "node:crypto";
import type { BondWatchRecord, BondWatchStage, WatcherReceipt } from "./types.js";

const allowed: Record<BondWatchStage, BondWatchStage[]> = {
  WATCH: ["HEATING", "IMMINENT", "BONDED", "REJECT"],
  HEATING: ["IMMINENT", "BONDED", "REJECT"],
  IMMINENT: ["BONDED", "REJECT"],
  BONDED: [],
  REJECT: [],
};

export function canTransition(from: BondWatchStage, to: BondWatchStage): boolean {
  return allowed[from].includes(to);
}

export function transition(
  record: BondWatchRecord,
  toStage: BondWatchStage,
  evidence: Record<string, unknown>,
): { record: BondWatchRecord; receipt: WatcherReceipt } {
  if (record.stage === toStage) {
    throw new Error(`Duplicate transition ${record.stage} -> ${toStage}`);
  }
  if (!canTransition(record.stage, toStage)) {
    throw new Error(`Invalid BondWatch transition ${record.stage} -> ${toStage}`);
  }

  const observedAt = new Date().toISOString();
  const receiptId = createHash("sha256")
    .update(`${record.chain}:${record.launchpad}:${record.token}:${record.stage}:${toStage}:${observedAt}`)
    .digest("hex");

  return {
    record: {
      ...record,
      stage: toStage,
      lastUpdatedAt: observedAt,
    },
    receipt: {
      receiptId,
      token: record.token,
      chain: record.chain,
      launchpad: record.launchpad,
      fromStage: record.stage,
      toStage,
      observedAt,
      evidence,
    },
  };
}
