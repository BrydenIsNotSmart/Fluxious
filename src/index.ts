import { Client } from "@fluxerjs/core";
import { join } from "path";
import { readdirSync } from "fs";
import { botToken } from "./config";
import { Collection } from "@discordjs/collection";
import type { FluxerClient } from "./types/client";
import { connectMongo } from "./database/mongo";
import { dbURL } from "./config";

const client = new Client({
  intents: 0,
  presence: {
    custom_status: { text: "Watching the Fluxious Network™" },
    status: "online",
  },
}) as FluxerClient;

await connectMongo(dbURL!);

client.commands = new Collection();
client.aliases = new Collection();

//-Events-//
const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter(
  (file) => file.endsWith(".ts") || file.endsWith(".js"),
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const eventModule = await import(filePath);
  const event = eventModule.default;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

//-Commands-//
const getFiles = (path: string) =>
  readdirSync(join(__dirname, path)).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js"),
  );

for (const cfile of getFiles("commands")) {
  const filePath = join(__dirname, "commands", cfile);
  const commandModule = await import(filePath);
  const command = commandModule.default;

  client.commands.set(command.name, command);

  if (command.aliases) {
    command.aliases.forEach((alias: string) =>
      client.aliases.set(alias, command.name),
    );
  }
}

console.log(`[INFO] Loaded ${client.commands.size} commands`);

await client.login(botToken!);
