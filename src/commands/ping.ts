import type { Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import { EmbedBuilder } from "@fluxerjs/core";
import { botPing, dbPing } from "../functions/getPing";
import { apiURL, embedColor } from "../config";

export default {
  name: "ping",
  aliases: ["p", "latency"],
  category: "Info",
  description: "Shows the bots latency with the Fluxer API.",
  usage: "ping",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const latency = await botPing(client);
    const databaseLatency = await dbPing();

    const start = Date.now();
    message.reply("Pinging...").then(async (msg) => {
      await msg.edit({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Pong!")
            .addFields(
              {
                name: "**Gateway**",
                value: latency ? `\`${latency}ms\`` : "`Gateway Error`",
                inline: true,
              },
              {
                name: "**Database**",
                value: `\`${databaseLatency}ms\``,
                inline: true,
              },
              {
                name: "**Round-trip**",
                value: `\`${Date.now() - start}ms\``,
                inline: true,
              },
            )
            .setFooter({ text: apiURL }),
        ],
      });
    });
  },
};
