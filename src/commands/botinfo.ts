import { EmbedBuilder, type Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import { embedColor } from "../config";
import { getCPUPercent } from "../functions/getCPUUsage";

export default {
  name: "botinfo",
  aliases: ["botinformation", "botstats", "info"],
  category: "Info",
  description: "Shows detailed information on the bot.",
  usage: "botinfo",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const fluxerVersion = require("@fluxerjs/core/package.json").version;
    const cpuPercent = await getCPUPercent();

    function memory() {
      return (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    }

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${client?.user?.username} Information`)
          .setColor(embedColor)
          .setThumbnail(client.user?.displayAvatarURL()!)
          .setDescription(
            `[Invite Me](https://web.fluxer.app/oauth2/authorize?client_id=1480748794495332454&scope=bot&permissions=2252901406010582) | [Support Server](https://fluxer.gg/YPGwEHAy)`,
          )
          .addFields(
            {
              name: "CPU",
              value: `\`${cpuPercent.toFixed(2)}%\``,
              inline: true,
            },
            {
              name: "RAM",
              value: `\`${memory()} MB\``,
              inline: true,
            },
            {
              name: "Uptime",
              value: `<t:${Math.floor((Date.now() - process.uptime() * 1000) / 1000)}:t>`,
              inline: true,
            },
            { name: "Servers", value: `${client.guilds.size}`, inline: true },
            {
              name: "Library",
              value: `[Fluxer.js](https://fluxer.js.org) v${fluxerVersion}`,
              inline: true,
            },
            {
              name: "Runtime",
              value: `[Bun](https://bun.sh) v${Bun.version}`,
              inline: true,
            },
          ),
      ],
    });
  },
};
