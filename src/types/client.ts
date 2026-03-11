import { Client } from "@fluxerjs/core";
import type { Command } from "./command";
import { Collection } from "@discordjs/collection";

export interface FluxerClient extends Client {
  commands: Collection<string, Command>;
  aliases: Collection<string, string>;
}
