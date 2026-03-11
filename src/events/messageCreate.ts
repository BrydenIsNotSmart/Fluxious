import type { FluxerClient } from "../types/client";
import { defaultPrefix, embedColor } from "../config";
import Server from "../database/models/Server";
import { Message, EmbedBuilder } from "@fluxerjs/core";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message, client: FluxerClient) {
    if (message.author.bot) return;

    if (message.guildId) {
      let server = await Server.findOne({ serverId: message.guildId });
      if (!server) {
        server = await Server.create({ serverId: message.guildId });
      }

      const prefix = server.prefix || defaultPrefix;

      if (
        message.content &&
        new RegExp(`^(<@!?${client?.user?.id}>)`).test(message.content)
      ) {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Hi! I'm ${client?.user?.username}`)
              .setDescription(
                `My prefix for this server is \`${prefix}\`.\n Need help? Run \`${prefix}help\``,
              ),
          ],
        });
      }

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const cmd = args.shift()?.toLowerCase();

      if (!cmd) return;

      const commandName = client.commands.has(cmd)
        ? cmd
        : client.aliases.get(cmd);

      if (!commandName) return;
      const command = client.commands.get(commandName);
      if (!command) return;

      command.execute(message, args, client);
    } else {
      message.reply(
        "Commands are only supported in servers and not DMs as of now.",
      );
    }
  },
};
