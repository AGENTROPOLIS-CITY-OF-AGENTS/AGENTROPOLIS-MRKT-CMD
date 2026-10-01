import type { Address } from "viem";
import { BondWatchEngine } from "./engine.js";
import { ManualAdapter } from "./adapters/manual.js";
import { PonsV2Adapter } from "./adapters/pons-v2.js";
import { ConsoleSink } from "./sinks/console.js";
import { FanoutSink, WebhookSink } from "./sinks/webhook.js";

const adapters = [];

if (process.env.BONDWATCH_PONS_RPC_URL) {
  adapters.push(
    new PonsV2Adapter({
      rpcUrl: process.env.BONDWATCH_PONS_RPC_URL,
      factory: (process.env.BONDWATCH_PONS_FACTORY ??
        "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e") as Address,
      fromBlock: process.env.BONDWATCH_PONS_FROM_BLOCK
        ? BigInt(process.env.BONDWATCH_PONS_FROM_BLOCK)
        : undefined,
      pollIntervalMs: process.env.BONDWATCH_POLL_MS
        ? Number(process.env.BONDWATCH_POLL_MS)
        : 1_500,
    }),
  );
} else {
  adapters.push(
    new ManualAdapter(
      process.env.BONDWATCH_LAUNCHPAD ?? "manual",
      process.env.BONDWATCH_CHAIN ?? "test",
    ),
  );
}

const sinks = [new ConsoleSink()];
if (process.env.BONDWATCH_WEBHOOK_URL) {
  sinks.push(new WebhookSink(process.env.BONDWATCH_WEBHOOK_URL));
}

const engine = new BondWatchEngine(adapters, new FanoutSink(sinks));
const stop = await engine.start();

console.log("[BondWatch] engine started");
console.log(
  process.env.BONDWATCH_PONS_RPC_URL
    ? "[BondWatch] Pons V2 live adapter active"
    : "[BondWatch] manual adapter active; set BONDWATCH_PONS_RPC_URL for live Pons tracking",
);

const shutdown = async () => {
  console.log("[BondWatch] shutting down");
  await stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
