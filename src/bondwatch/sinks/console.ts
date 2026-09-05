import type { BondWatchSink } from "../engine.js";
import type { BondWatchRecord, TokenBondedEvent, WatcherReceipt } from "../types.js";

export class ConsoleSink implements BondWatchSink {
  async onRecord(record: BondWatchRecord): Promise<void> {
    console.log("[BondWatch][record]", JSON.stringify(record, bigintReplacer));
  }

  async onReceipt(receipt: WatcherReceipt): Promise<void> {
    console.log("[BondWatch][receipt]", JSON.stringify(receipt, bigintReplacer));
  }

  async onBonded(event: TokenBondedEvent): Promise<void> {
    console.log("[BondWatch][BONDED]", JSON.stringify(event, bigintReplacer));
  }
}

function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}
