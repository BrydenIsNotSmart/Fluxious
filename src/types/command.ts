import type { Message } from "@fluxerjs/core";
import type { FluxerClient } from "./client";

export interface Command {
  name: string;
  aliases?: string[];
  category?: string;
  description?: string;
  usage?: string;
  execute(
    message: Message,
    args: string[],
    client: FluxerClient,
  ): Promise<void> | void;
}
