import type { FluxerClient } from "../types/client";
import mongoose from "mongoose";

export async function botPing(client: FluxerClient): Promise<number | null> {
  try {
    const start = Date.now();
    await client.rest.get("/gateway/bot");
    return Date.now() - start;
  } catch {
    return null;
  }
}

export async function dbPing() {
  const start = Date.now();
  await mongoose.connection.db?.admin().ping();
  return Date.now() - start;
}
