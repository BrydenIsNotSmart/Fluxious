import { CategoryChannel, EmbedBuilder, type Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import { embedColor } from "../config";
import { getCPUPercent } from "../functions/getCPUUsage";

export default {
  name: "serverinfo",
  aliases: ["serverinformation", "serverstats", "server"],
  category: "Info",
  description: "Shows detailed information on this server.",
  usage: "serverinfo",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const serverIcon =
      message.guild?.iconURL() ||
      `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
        message.guild?.name ?? "Server",
      )}&backgroundColor=4640d8`;

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${message.guild?.name} Information`)
          .setColor(embedColor)
          .setThumbnail(serverIcon)
          .setDescription(
            `[Icon](${serverIcon}) ${message.guild?.banner ? `| [Banner](${message.guild.bannerURL()})` : ""}`,
          )
          .setFooter({ text: `ID: ${message.guildId}` })
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
              value: `${message.guild?.channels.filter((c) => c.type === ("category" as any)).size ?? 0}`,
            },
          ),
      ],
    });
  },
};
