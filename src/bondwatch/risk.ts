import type { BondMetrics, RiskAssessment } from "./types.js";

export interface RiskInputs {
  metrics: BondMetrics;
  mintAuthorityRenounced?: boolean;
  freezeAuthorityRenounced?: boolean;
  liquidityVerified?: boolean;
  honeypotFlag?: boolean;
  spoofFlag?: boolean;
  creatorWalletFlag?: boolean;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function assessRisk(input: RiskInputs): RiskAssessment {
  const flags: string[] = [];
  let risk = 35;
  let quality = 50;
  let evidence = 0;

  if (input.liquidityVerified === true) {
    risk -= 10;
    quality += 10;
    evidence += 1;
  }

  if (input.mintAuthorityRenounced === true) {
    risk -= 8;
    quality += 5;
    evidence += 1;
  }

  if (input.freezeAuthorityRenounced === true) {
    risk -= 6;
    quality += 4;
    evidence += 1;
  }

  const creator = input.metrics.creatorConcentration;
  if (typeof creator === "number") {
    evidence += 1;
    if (creator >= 20) {
      risk += 25;
      quality -= 20;
      flags.push("HIGH_CREATOR_CONCENTRATION");
    } else if (creator >= 10) {
      risk += 12;
      quality -= 8;
      flags.push("ELEVATED_CREATOR_CONCENTRATION");
    }
  }

  const top10 = input.metrics.top10Concentration;
  if (typeof top10 === "number") {
    evidence += 1;
    if (top10 >= 60) {
      risk += 20;
      quality -= 15;
      flags.push("HIGH_TOP10_CONCENTRATION");
    }
  }

  if (input.metrics.uniqueBuyers !== undefined) {
    evidence += 1;
    if (input.metrics.uniqueBuyers < 20) {
      risk += 8;
      flags.push("LOW_BUYER_DIVERSITY");
    } else if (input.metrics.uniqueBuyers >= 100) {
      quality += 8;
    }
  }

  if (input.honeypotFlag) {
    risk = 100;
    quality = 0;
    flags.push("HONEYPOT_RISK");
  }
  if (input.spoofFlag) {
    risk = 100;
    quality = 0;
    flags.push("SPOOF_RISK");
  }
  if (input.creatorWalletFlag) {
    risk += 30;
    quality -= 20;
    flags.push("CREATOR_WALLET_RISK");
  }

  return {
    riskScore: clamp(risk),
    qualityScore: clamp(quality),
    confidence: clamp(20 + evidence * 12),
    flags,
  };
}
