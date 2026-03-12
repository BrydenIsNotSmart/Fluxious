import { EmbedBuilder, PermissionFlags, type Message } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import Server from "../database/models/Server";
import { getMemberPerms } from "../functions/getMemberPermissions";

export default {
  name: "counting",
  aliases: ["c", "count", "123", "ct"],
  category: "General",
  description: "Setup/toggle the Fluxious counting system in this server.",
  usage:
    "counting toggle | counting channel [channel id or mention] | counting reset",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const server = await Server.findOne({ serverId: message.guildId });
    const perms = await getMemberPerms(message);

    try {
      if (args[0] == "channel") {
        if (!perms?.has(PermissionFlags.ManageGuild))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Insufficient Permissions")
                .setDescription(
                  `You need the \`Manage Server\` permission in order to change the counting channel!`,
                ),
            ],
          });

        if (!args[1])
          return message.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                `:x: Please provide a correct channel mention or id to set as the counting channel.\n Ex: \`counting channel <channel mention or id>\``,
              ),
            ],
          });
        const channelId = args[1]?.replace(/[<#>]/g, "");
        if (!channelId)
          return message.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                `:x: Please provide a correct channel mention or id to set as the counting channel.\n Ex: \`counting channel <channel mention or id>\``,
              ),
            ],
          });
        let channel;

        try {
          channel = await client.channels.fetch(channelId);
        } catch (err: any) {
          if (
            err?.code === "CHANNEL_NOT_FOUND" ||
            err?.code === "UNKNOWN_CHANNEL"
          ) {
            return message.reply({
              embeds: [
                new EmbedBuilder().setDescription(
                  ":x: Please provide a **valid channel mention or ID**.",
                ),
              ],
            });
          }

          throw err;
        }

        await Server.findOneAndUpdate(
          { serverId: message.guildId },
          { $set: { countingChannel: channel.id } },
          { returnDocument: "after", upsert: true },
        );

        message.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              `<#${channel.id}> has been selected as the new counting channel.\nYou can toggle the counting module off and on by using \`counting toggle\`\n**You can no longer run commands in this channel, and the bot will act on counting only, and will delete messages if it doens't follow the counting order.\n\nThe counting module is currently **${server?.countingEnabled ? "on" : "off"}**.`,
            ),
          ],
        });
      } else if (args[0] == "toggle") {
        if (!perms?.has(PermissionFlags.ManageGuild))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Insufficient Permissions")
                .setDescription(
                  `You need the \`Manage Server\` permission in order to toggle the counting module!`,
                ),
            ],
          });

        if (!server?.countingChannel)
          return message.reply(
            ":x: Please set a counting channel with \`counting channel <channel mention or id>\` first.",
          );

        if (server?.countingEnabled === true) {
          await Server.findOneAndUpdate(
            { serverId: message.guildId },
            { $set: { countingEnabled: false } },
            { returnDocument: "after", upsert: true },
          );
          message.reply(
            `I have successfully **disabled** the counting system.`,
          );
        } else {
          await Server.findOneAndUpdate(
            { serverId: message.guildId },
            { $set: { countingEnabled: true, countingNumber: 1 } },
            { returnDocument: "after", upsert: true },
          );
          message.reply(`I have successfully **enabled** the counting system.`);
          const channel = message.guild?.channels.find(
            (c) => c.id === server.countingChannel,
          );
          channel?.send({
            content:
              "Counting system has been enabled, you may start with **2**.\n\n1",
          });
        }
      } else if (args[0] == "reset") {
        if (!perms?.has(PermissionFlags.ManageGuild))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Insufficient Permissions")
                .setDescription(
                  `You need the \`Manage Server\` permission in order to toggle counting reset!`,
                ),
            ],
          });
        if (!server?.countingChannel)
          return message.reply(
            "Please set a counting channel with \`counting channel <channel mention or id>\` first.",
          );
        if (server.countingReset === true) {
          await Server.findOneAndUpdate(
            { serverId: message.guildId },
            { $set: { countingReset: false, countingMember: null } },
            { returnDocument: "after", upsert: true },
          );

          message.reply(`I have successfully **disabled** the counting reset.`);
        } else {
          await Server.findOneAndUpdate(
            { serverId: message.guildId },
            { $set: { countingReset: true } },
            { returnDocument: "after", upsert: true },
          );
          message.reply(`I have successfully **enabled** the counting reset.`);
        }
      } else if (args[0] == "set") {
        if (!perms?.has(PermissionFlags.ManageGuild))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Insufficient Permissions")
                .setDescription(
                  `You need the \`Manage Server\` permission in order to set the counting number!`,
                ),
            ],
          });
        if (!server?.countingChannel)
          return message.reply(
            "Please set a counting channel with \`counting channel <channel mention or id>\` first.",
          );

        let number = Number(args[1]);
        if (!number)
          return message.reply(
            ":x: Please provide me with a number to set the current counting number to.",
          );
        if (isNaN(number))
          return message.reply(":x: You provided me with an invaild number.");

        await Server.findOneAndUpdate(
          { serverId: message.guildId },
          { $set: { countingNumber: number } },
          { returnDocument: "after", upsert: true },
        );

        const channel = message.guild?.channels.find(
          (c) => c.id === server.countingChannel,
        );
        channel?.send({
          content: `**The current counting number has been changed to \`${number}\`, you can continue with \`${number + 1}\`.**`,
        });
        message.reply(
          `:white_check_mark: I have successfully changed the current counting number to ${number}.`,
        );
      } else {
        await message.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              `**Counting System**\n\nSet counting channel -> \`counting channel <channel>\`\nToggle counting on/off -> \`counting toggle\`\nToggle count reset on/off -> \`counting reset\`\nSet the counting number -> \`counting set <number>\``,
            ),
          ],
        });
      }
    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `:x: There was an error while executing this commmand! \n \`\`\`ts\n${err}\n\`\`\``,
          ),
        ],
      });
    }
  },
};
