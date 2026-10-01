import { createPublicClient, http, parseAbiItem, type Address } from "viem";
import type { LaunchpadAdapter, LaunchpadObservation } from "./adapter.js";
import type { CursorStore } from "../storage/cursor.js";
import { FileCursorStore } from "../storage/cursor.js";

const tokenLaunchedEvent = parseAbiItem(
  "event TokenLaunched(address indexed token,address indexed curve,address indexed deployer,address pairToken,uint256 launchConfigId,uint256 graduationThreshold)"
);

const launchSweptEvent = parseAbiItem(
  "event LaunchSwept(address indexed token,uint256 quoteOut,uint256 tokenOut)"
);

const poolGraduatedEvent = parseAbiItem(
  "event PoolGraduated(address indexed token,uint256 positionId,uint256 tokenAmount,uint256 pairTokenAmount)"
);

const curveCompletedEvent = parseAbiItem(
  "event CurveCompleted(address recipient,uint256 quoteOut,uint256 tokenOut)"
);

const curveAbi = [
  {
    type: "function",
    name: "realQuoteReserve",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "graduationThreshold",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

export interface PonsV2AdapterOptions {
  rpcUrl: string;
  factory: Address;
  fromBlock?: bigint;
  pollIntervalMs?: number;
  cursorStore?: CursorStore;
}

interface LaunchMeta {
  curve: Address;
  creator: Address;
  graduationThreshold: bigint;
}

export class PonsV2Adapter implements LaunchpadAdapter {
  readonly id = "pons-v2";
  readonly chain = "robinhood-chain";

  private readonly client;
  private readonly factory: Address;
  private readonly fromBlock?: bigint;
  private readonly pollIntervalMs: number;
  private readonly cursorStore: CursorStore;
  private readonly launches = new Map<string, LaunchMeta>();
  private running = false;

  constructor(options: PonsV2AdapterOptions) {
    this.factory = options.factory;
    this.fromBlock = options.fromBlock;
    this.pollIntervalMs = options.pollIntervalMs ?? 1_500;
    this.cursorStore = options.cursorStore ?? new FileCursorStore();
    this.client = createPublicClient({ transport: http(options.rpcUrl) });
  }

  async start(
    onObservation: (observation: LaunchpadObservation) => Promise<void>,
  ): Promise<() => Promise<void>> {
    this.running = true;
    const key = `${this.chain}:${this.id}:${this.factory.toLowerCase()}`;
    const latest = await this.client.getBlockNumber();
    const stored = await this.cursorStore.load(key);
    let nextBlock = stored !== undefined ? stored + 1n : this.fromBlock ?? latest;

    const loop = async () => {
      while (this.running) {
        try {
          const head = await this.client.getBlockNumber();
          if (nextBlock <= head) {
            await this.scan(nextBlock, head, onObservation);
            await this.cursorStore.save(key, head);
            nextBlock = head + 1n;
          }
        } catch (error) {
          console.error("[BondWatch][pons-v2] scan failed", error);
        }
        await delay(this.pollIntervalMs);
      }
    };

    void loop();
    return async () => {
      this.running = false;
    };
  }

  private async scan(
    fromBlock: bigint,
    toBlock: bigint,
    onObservation: (observation: LaunchpadObservation) => Promise<void>,
  ): Promise<void> {
    const launchLogs = await this.client.getLogs({
      address: this.factory,
      event: tokenLaunchedEvent,
      fromBlock,
      toBlock,
    });

    for (const log of launchLogs) {
      const token = log.args.token;
      const curve = log.args.curve;
      const creator = log.args.deployer;
      const graduationThreshold = log.args.graduationThreshold;
      if (!token || !curve || !creator || graduationThreshold === undefined) continue;

      this.launches.set(token.toLowerCase(), { curve, creator, graduationThreshold });

      await onObservation({
        kind: "TOKEN_CREATED",
        token,
        creator,
        blockNumber: log.blockNumber ?? undefined,
        transactionHash: log.transactionHash ?? undefined,
        observedAt: new Date().toISOString(),
        payload: {
          curve,
          pairToken: log.args.pairToken,
          launchConfigId: log.args.launchConfigId?.toString(),
          graduationThreshold: graduationThreshold.toString(),
          source: "PonsV2LaunchFactory.TokenLaunched",
        },
      });
    }

    const sweptLogs = await this.client.getLogs({
      address: this.factory,
      event: launchSweptEvent,
      fromBlock,
      toBlock,
    });

    for (const log of sweptLogs) {
      const token = log.args.token;
      if (!token) continue;
      await onObservation({
        kind: "GRADUATION_HINT",
        token,
        blockNumber: log.blockNumber ?? undefined,
        transactionHash: log.transactionHash ?? undefined,
        observedAt: new Date().toISOString(),
        payload: {
          quoteOut: log.args.quoteOut?.toString(),
          tokenOut: log.args.tokenOut?.toString(),
          curveProgress: 100,
          source: "PonsV2LaunchFactory.LaunchSwept",
        },
      });
    }

    const poolLogs = await this.client.getLogs({
      address: this.factory,
      event: poolGraduatedEvent,
      fromBlock,
      toBlock,
    });

    for (const log of poolLogs) {
      const token = log.args.token;
      if (!token) continue;
      await onObservation({
        kind: "LIQUIDITY_CREATED",
        token,
        blockNumber: log.blockNumber ?? undefined,
        transactionHash: log.transactionHash ?? undefined,
        observedAt: new Date().toISOString(),
        payload: {
          venue: "uniswap-v4",
          positionId: log.args.positionId?.toString(),
          tokenAmount: log.args.tokenAmount?.toString(),
          pairTokenAmount: log.args.pairTokenAmount?.toString(),
          curveProgress: 100,
          source: "PonsV2LaunchFactory.PoolGraduated",
        },
      });
    }

    for (const [token, meta] of this.launches) {
      const curveLogs = await this.client.getLogs({
        address: meta.curve,
        event: curveCompletedEvent,
        fromBlock,
        toBlock,
      });

      const progress = await this.readCurveProgress(meta.curve, meta.graduationThreshold);
      const last = curveLogs.at(-1);
      await onObservation({
        kind: last || progress >= 95 ? "GRADUATION_HINT" : "CURVE_UPDATE",
        token,
        creator: meta.creator,
        blockNumber: last?.blockNumber ?? undefined,
        transactionHash: last?.transactionHash ?? undefined,
        observedAt: new Date().toISOString(),
        payload: {
          curve: meta.curve,
          curveProgress: progress,
          source: last
            ? "PonsV2BondingCurve.CurveCompleted"
            : "PonsV2BondingCurve.realQuoteReserve",
        },
      });
    }
  }

  private async readCurveProgress(curve: Address, fallbackThreshold: bigint): Promise<number> {
    const [reserve, threshold] = await Promise.all([
      this.client.readContract({ address: curve, abi: curveAbi, functionName: "realQuoteReserve" }),
      this.client
        .readContract({ address: curve, abi: curveAbi, functionName: "graduationThreshold" })
        .catch(() => fallbackThreshold),
    ]);
    if (threshold === 0n) return 0;
    const basisPoints = (reserve * 10_000n) / threshold;
    return Math.max(0, Math.min(100, Number(basisPoints) / 100));
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
