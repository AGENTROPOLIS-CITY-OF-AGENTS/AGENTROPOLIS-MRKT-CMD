import type { BondWatchRecord } from "../types.js";

export interface LaunchpadObservation {
  kind: "TOKEN_CREATED" | "CURVE_UPDATE" | "GRADUATION_HINT" | "LIQUIDITY_CREATED" | "REJECT";
  token: string;
  creator?: string;
  blockNumber?: bigint;
  transactionHash?: string;
  observedAt: string;
  payload: Record<string, unknown>;
}

export interface LaunchpadAdapter {
  readonly id: string;
  readonly chain: string;
  start(onObservation: (observation: LaunchpadObservation) => Promise<void>): Promise<() => Promise<void>>;
  hydrate?(token: string): Promise<Partial<BondWatchRecord>>;
}
