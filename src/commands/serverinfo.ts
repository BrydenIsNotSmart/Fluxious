import { EmbedBuilder, type Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import { embedColor } from "../config";

function getSnowflakeTimestamp(id: string): Date {
  const DISCORD_EPOCH = 1420070400000n;
  const timestamp = (BigInt(id) >> 22n) + DISCORD_EPOCH;
  return new Date(Number(timestamp));
}

export default {
  name: "serverinfo",
  aliases: ["serverinformation", "serverstats", "server", "si"],
  category: "Info",
  description: "Shows detailed information on this server.",
  usage: "serverinfo",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const serverIcon =
      message.guild?.iconURL() ||
      `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
        message.guild?.name ?? "Server",
      )}&backgroundColor=4640d8`;

    const createdAt = getSnowflakeTimestamp(message.guildId!);

    message.guild?.fetchChannels();

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${message.guild?.name} Information`)
          .setColor(embedColor)
          .setThumbnail(serverIcon)
          .setDescription(
            `[Icon](${serverIcon}) ${message.guild?.banner ? `| [Banner](${message.guild.bannerURL()})` : ""}`,
          )
          .setFooter({
            text: `ID: ${message.guildId} • Created: ${createdAt.toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}`,
          })
          .addFields(
            {
              name: "Owner",
              value: `<@${message.guild?.ownerId}>`,
              inline: true,
            },
            {
              name: "Members",
              value: `${message.guild?.members.size}`,
              inline: true,
            },
            {
              name: "Roles",
              value: `${message.guild?.roles.size}`,
              inline: true,
            },
            {
              name: "Categories",
              value: `${message.guild?.channels.filter((c) => c.type === 4).size ?? 0}`,
              inline: true,
            },
            {
              name: "Text Channels",
              value: `${message.guild?.channels.filter((c) => c.type == 0).size ?? 0}`,
              inline: true,
            },
            {
              name: "Voice Channels",
              value: `${message.guild?.channels.filter((c) => c.type == 2).size ?? 0}`,
              inline: true,
            },
            {
              name: "Features",
              value: `\`\`\`${message.guild?.features.join(", ")}\`\`\``,
            },
          ),
      ],
    });
  },
};
