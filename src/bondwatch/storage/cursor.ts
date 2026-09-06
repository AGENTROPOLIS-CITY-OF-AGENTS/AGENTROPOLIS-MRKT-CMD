import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface CursorStore {
  load(key: string): Promise<bigint | undefined>;
  save(key: string, blockNumber: bigint): Promise<void>;
}

export class FileCursorStore implements CursorStore {
  constructor(private readonly path = process.env.BONDWATCH_CURSOR_FILE ?? ".bondwatch/cursors.json") {}

  async load(key: string): Promise<bigint | undefined> {
    try {
      const raw = await readFile(this.path, "utf8");
      const parsed = JSON.parse(raw) as Record<string, string>;
      const value = parsed[key];
      return value === undefined ? undefined : BigInt(value);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }

  async save(key: string, blockNumber: bigint): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });

    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(await readFile(this.path, "utf8")) as Record<string, string>;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const current = parsed[key] === undefined ? undefined : BigInt(parsed[key]);
    if (current !== undefined && current >= blockNumber) return;

    parsed[key] = blockNumber.toString();
    const tmp = `${this.path}.tmp`;
    await writeFile(tmp, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    await rename(tmp, this.path);
  }
}
