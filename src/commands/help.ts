import { EmbedBuilder, type Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import { defaultPrefix, embedColor } from "../config";
import Server from "../database/models/Server";

export default {
  name: "help",
  aliases: ["ineedhelp", "h"],
  category: "General",
  description:
    "View a list of commands the bot has, and get a detailed view of a certain command.",
  usage: "help or help (command name)",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const query = args[0]?.toLowerCase();
    const server = await Server.findOne({ serverId: message.guildId });

    if (query) {
      const command =
        client.commands.get(query) ||
        [...client.commands.values()].find((cmd) =>
          cmd.aliases?.map((a) => a.toLowerCase()).includes(query),
        );

      if (!command) {
        return message.reply(
          `No command found with name or alias \`${query}\``,
        );
      }

      const embed = new EmbedBuilder()
        .setTitle(`Command: ${command.name}`)
        .setDescription(command.description ?? "No description.")
        .setColor(embedColor)
        .addFields(
          {
            name: "Aliases",
            value: command.aliases?.length
              ? command.aliases.map((a) => `\`${a}\``).join(", ")
              : "None",
            inline: true,
          },
          {
            name: "Usage",
            value: command.usage
              ? `\`\`\`${command.usage}\`\`\``
              : "No usage info.",
            inline: false,
          },
        );

      return message.reply({ embeds: [embed] });
    }

    const categories: Record<string, string[]> = {};

    for (const cmd of client.commands.values()) {
      const category = cmd.category ?? "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(`\`${cmd.name}\``);
    }

    const sortedCategories = Object.keys(categories).sort();

    const embed = new EmbedBuilder()
      .setTitle("Available Commands")
      .setColor(embedColor)
      .setDescription(
        `To see a more detailed view of a command, run ${server?.prefix || defaultPrefix}help [command]`,
      )
      .addFields(
        ...sortedCategories.map((cat) => ({
          name: cat,
          value: categories[cat]!.sort().join(", "),
          inline: false,
        })),
      );

    message.reply({ embeds: [embed] });
  },
};
