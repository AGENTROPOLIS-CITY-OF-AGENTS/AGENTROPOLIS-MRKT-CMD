import type { LaunchpadAdapter, LaunchpadObservation } from "./adapters/adapter.js";
import { assessRisk } from "./risk.js";
import { transition } from "./state-machine.js";
import type { BondWatchRecord, BondWatchStage, TokenBondedEvent, WatcherReceipt } from "./types.js";

export interface BondWatchSink {
  onRecord(record: BondWatchRecord): Promise<void>;
  onReceipt(receipt: WatcherReceipt): Promise<void>;
  onBonded(event: TokenBondedEvent): Promise<void>;
}

export class BondWatchEngine {
  private readonly records = new Map<string, BondWatchRecord>();
  private readonly seen = new Set<string>();

  constructor(
    private readonly adapters: LaunchpadAdapter[],
    private readonly sink: BondWatchSink,
  ) {}

  async start(): Promise<() => Promise<void>> {
    const stops = await Promise.all(
      this.adapters.map((adapter) =>
        adapter.start(async (observation) => {
          await this.handle(adapter, observation);
        }),
      ),
    );

    return async () => {
      await Promise.all(stops.map((stop) => stop()));
    };
  }

  private key(adapter: LaunchpadAdapter, token: string): string {
    return `${adapter.chain}:${adapter.id}:${token.toLowerCase()}`;
  }

  private observationKey(adapter: LaunchpadAdapter, observation: LaunchpadObservation): string {
    return [
      adapter.chain,
      adapter.id,
      observation.kind,
      observation.token.toLowerCase(),
      observation.blockNumber?.toString() ?? "na",
      observation.transactionHash ?? "na",
    ].join(":");
  }

  private async handle(adapter: LaunchpadAdapter, observation: LaunchpadObservation): Promise<void> {
    const dedupeKey = this.observationKey(adapter, observation);
    if (this.seen.has(dedupeKey)) return;
    this.seen.add(dedupeKey);

    const key = this.key(adapter, observation.token);
    let record = this.records.get(key);

    if (!record) {
      record = {
        chain: adapter.chain,
        launchpad: adapter.id,
        token: observation.token,
        creator: observation.creator,
        createdAt: observation.kind === "TOKEN_CREATED" ? observation.observedAt : undefined,
        createdBlock: observation.kind === "TOKEN_CREATED" ? observation.blockNumber : undefined,
        stage: "WATCH",
        metrics: {},
        liquidity: {},
        risk: assessRisk({ metrics: {} }),
        metadata: {},
        lastUpdatedAt: observation.observedAt,
      };
      this.records.set(key, record);
      await this.sink.onRecord(record);
    }

    record = this.applyPayload(record, observation);

    const nextStage = this.stageFor(observation, record);
    if (nextStage && nextStage !== record.stage) {
      const result = transition(record, nextStage, {
        kind: observation.kind,
        blockNumber: observation.blockNumber?.toString(),
        transactionHash: observation.transactionHash,
        ...observation.payload,
      });
      record = result.record;
      await this.sink.onReceipt(result.receipt);
    }

    this.records.set(key, record);
    await this.sink.onRecord(record);

    if (record.stage === "BONDED") {
      await this.sink.onBonded({
        event: "TOKEN_BONDED",
        chain: record.chain,
        launchpad: record.launchpad,
        token: record.token,
        creator: record.creator,
        createdAt: record.createdAt,
        bondedAt: record.liquidity.bondedAt ?? observation.observedAt,
        bondTimeSeconds:
          record.createdAt && record.liquidity.bondedAt
            ? Math.max(0, Math.floor((Date.parse(record.liquidity.bondedAt) - Date.parse(record.createdAt)) / 1000))
            : undefined,
        liquidityVenue: record.liquidity.venue,
        pool: record.liquidity.pool,
        liquidityUsd: record.liquidity.liquidityUsd,
        holders: record.metrics.holders,
        uniqueBuyers: record.metrics.uniqueBuyers,
        creatorConcentration: record.metrics.creatorConcentration,
        top10Concentration: record.metrics.top10Concentration,
        riskScore: record.risk.riskScore,
        qualityScore: record.risk.qualityScore,
        confidence: record.risk.confidence,
        receiptId: `${record.chain}:${record.launchpad}:${record.token}:${record.liquidity.bondedBlock?.toString() ?? "bonded"}`,
      });
    }
  }

  private applyPayload(record: BondWatchRecord, observation: LaunchpadObservation): BondWatchRecord {
    const p = observation.payload;
    const metrics = {
      ...record.metrics,
      ...(typeof p.curveProgress === "number" ? { curveProgress: p.curveProgress } : {}),
      ...(typeof p.holders === "number" ? { holders: p.holders } : {}),
      ...(typeof p.uniqueBuyers === "number" ? { uniqueBuyers: p.uniqueBuyers } : {}),
      ...(typeof p.txVelocityPerMinute === "number" ? { txVelocityPerMinute: p.txVelocityPerMinute } : {}),
      ...(typeof p.creatorConcentration === "number" ? { creatorConcentration: p.creatorConcentration } : {}),
      ...(typeof p.top10Concentration === "number" ? { top10Concentration: p.top10Concentration } : {}),
    };

    const liquidity = {
      ...record.liquidity,
      ...(typeof p.venue === "string" ? { venue: p.venue } : {}),
      ...(typeof p.pool === "string" ? { pool: p.pool } : {}),
      ...(typeof p.liquidityUsd === "number" ? { liquidityUsd: p.liquidityUsd } : {}),
      ...(observation.kind === "LIQUIDITY_CREATED"
        ? { bondedAt: observation.observedAt, bondedBlock: observation.blockNumber }
        : {}),
    };

    const risk = assessRisk({
      metrics,
      liquidityVerified: observation.kind === "LIQUIDITY_CREATED" || Boolean(liquidity.pool),
      honeypotFlag: p.honeypotFlag === true,
      spoofFlag: p.spoofFlag === true,
      creatorWalletFlag: p.creatorWalletFlag === true,
      mintAuthorityRenounced: p.mintAuthorityRenounced === true,
      freezeAuthorityRenounced: p.freezeAuthorityRenounced === true,
    });

    return {
      ...record,
      creator: record.creator ?? observation.creator,
      metrics,
      liquidity,
      risk,
      metadata: { ...record.metadata, ...p },
      lastUpdatedAt: observation.observedAt,
    };
  }

  private stageFor(observation: LaunchpadObservation, record: BondWatchRecord): BondWatchStage | undefined {
    if (observation.kind === "REJECT" || record.risk.riskScore >= 95) return "REJECT";
    if (observation.kind === "LIQUIDITY_CREATED") return "BONDED";
    if (observation.kind === "GRADUATION_HINT") return "IMMINENT";

    const progress = record.metrics.curveProgress ?? 0;
    const velocity = record.metrics.txVelocityPerMinute ?? 0;
    if (progress >= 95 || (progress >= 90 && velocity >= 20)) return "IMMINENT";
    if (progress >= 70 || velocity >= 30) return "HEATING";
    return undefined;
  }
}
