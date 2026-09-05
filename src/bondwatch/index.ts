import { BondWatchEngine } from "./engine.js";
import { ManualAdapter } from "./adapters/manual.js";
import { ConsoleSink } from "./sinks/console.js";

const adapter = new ManualAdapter(
  process.env.BONDWATCH_LAUNCHPAD ?? "manual",
  process.env.BONDWATCH_CHAIN ?? "test",
);

const engine = new BondWatchEngine([adapter], new ConsoleSink());
const stop = await engine.start();

console.log("[BondWatch] engine started");
console.log("[BondWatch] waiting for configured live launchpad adapters");

const shutdown = async () => {
  console.log("[BondWatch] shutting down");
  await stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
