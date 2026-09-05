import type { LaunchpadAdapter, LaunchpadObservation } from "./adapter.js";

export class ManualAdapter implements LaunchpadAdapter {
  readonly id: string;
  readonly chain: string;
  private handler?: (observation: LaunchpadObservation) => Promise<void>;

  constructor(id = "manual", chain = "test") {
    this.id = id;
    this.chain = chain;
  }

  async start(
    onObservation: (observation: LaunchpadObservation) => Promise<void>,
  ): Promise<() => Promise<void>> {
    this.handler = onObservation;
    return async () => {
      this.handler = undefined;
    };
  }

  async emit(observation: LaunchpadObservation): Promise<void> {
    if (!this.handler) throw new Error("ManualAdapter has not been started");
    await this.handler(observation);
  }
}
