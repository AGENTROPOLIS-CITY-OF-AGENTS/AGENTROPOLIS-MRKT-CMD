export type BondWatchStage =
  | "WATCH"
  | "HEATING"
  | "IMMINENT"
  | "BONDED"
  | "REJECT";

export type ChainId = "solana" | "base" | "robinhood-chain" | string;

export interface TokenIdentity {
  chain: ChainId;
  launchpad: string;
  token: string;
  creator?: string;
  createdAt?: string;
  createdBlock?: bigint;
}

export interface BondMetrics {
  curveProgress?: number;
  curveReserves?: string;
  holders?: number;
  uniqueBuyers?: number;
  buyCount?: number;
  sellCount?: number;
  buyVolume?: string;
  sellVolume?: string;
  txVelocityPerMinute?: number;
  creatorConcentration?: number;
  top10Concentration?: number;
  marketCapUsd?: number;
  fdvUsd?: number;
}

export interface LiquidityState {
  venue?: string;
  pool?: string;
  liquidityUsd?: number;
  bondedAt?: string;
  bondedBlock?: bigint;
}

export interface RiskAssessment {
  riskScore: number;
  qualityScore: number;
  confidence: number;
  flags: string[];
}

export interface RiggedEvidence {
  code: string;
  weight: number;
  observed: number | boolean | string;
  explanation: string;
}

export interface RiggedAssessment {
  manipulationRiskScore: number;
  confidence: number;
  level: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL";
  flags: string[];
  evidence: RiggedEvidence[];
  disclaimer: string;
}

export interface BondWatchRecord extends TokenIdentity {
  stage: BondWatchStage;
  metrics: BondMetrics;
  liquidity: LiquidityState;
  risk: RiskAssessment;
  rigged?: RiggedAssessment;
  metadata?: Record<string, unknown>;
  lastUpdatedAt: string;
}

export interface TokenBondedEvent {
  event: "TOKEN_BONDED";
  chain: ChainId;
  launchpad: string;
  token: string;
  creator?: string;
  createdAt?: string;
  bondedAt: string;
  bondTimeSeconds?: number;
  liquidityVenue?: string;
  pool?: string;
  liquidityUsd?: number;
  holders?: number;
  uniqueBuyers?: number;
  creatorConcentration?: number;
  top10Concentration?: number;
  riskScore: number;
  qualityScore: number;
  confidence: number;
  rigged?: RiggedAssessment;
  receiptId: string;
}

export interface WatcherReceipt {
  receiptId: string;
  token: string;
  chain: ChainId;
  launchpad: string;
  fromStage?: BondWatchStage;
  toStage: BondWatchStage;
  observedAt: string;
  evidence: Record<string, unknown>;
}
