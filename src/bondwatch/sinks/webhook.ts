import type { BondWatchSink } from "../engine.js";
import type { BondWatchRecord, TokenBondedEvent, WatcherReceipt } from "../types.js";

export class WebhookSink implements BondWatchSink {
  constructor(private readonly url: string) {}

  async onRecord(_record: BondWatchRecord): Promise<void> {}

  async onReceipt(_receipt: WatcherReceipt): Promise<void> {}

  async onBonded(event: TokenBondedEvent): Promise<void> {
    const started = Date.now();
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "BONDWATCH_BONDED",
        emittedAt: new Date().toISOString(),
        event,
      }),
    });

    if (!response.ok) {
      throw new Error(`BondWatch webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log(`[BondWatch][webhook] delivered in ${Date.now() - started}ms`);
  }
}

export class FanoutSink implements BondWatchSink {
  constructor(private readonly sinks: BondWatchSink[]) {}

  async onRecord(record: BondWatchRecord): Promise<void> {
    await Promise.allSettled(this.sinks.map((sink) => sink.onRecord(record)));
  }

  async onReceipt(receipt: WatcherReceipt): Promise<void> {
    await Promise.allSettled(this.sinks.map((sink) => sink.onReceipt(receipt)));
  }

  async onBonded(event: TokenBondedEvent): Promise<void> {
    const results = await Promise.allSettled(this.sinks.map((sink) => sink.onBonded(event)));
    const rejected = results.filter((result) => result.status === "rejected");
    for (const result of rejected) {
      console.error("[BondWatch][sink] delivery failure", (result as PromiseRejectedResult).reason);
    }
  }
}
