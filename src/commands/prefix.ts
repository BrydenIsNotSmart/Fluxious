import { EmbedBuilder, type Message, PermissionFlags } from "@fluxerjs/core";
import type { FluxerClient } from "../types/client";
import Server from "../database/models/Server";
import { defaultPrefix } from "../config";
import { getMemberPerms } from "../functions/getMemberPermissions";

export default {
  name: "prefix",
  category: "Admin",
  description: "View or set the prefix for this server.",
  usage: "prefix or prefix set (new prefix)",

  async execute(message: Message, args: string[], client: FluxerClient) {
    const server = await Server.findOne({ serverId: message.guildId });
    const perms = await getMemberPerms(message);

    if (!perms) return;

    if (!args[0]) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Prefix")
            .setDescription(
              `The current prefix for this server is ${
                server?.prefix || defaultPrefix
              }${perms.has(PermissionFlags.ManageGuild) ? `\nYou can update it with \`${server?.prefix || defaultPrefix}prefix set (new prefix here)\`` : ""}`,
            ),
        ],
      });
    } else if (args[0] == "set") {
      if (!perms.has(PermissionFlags.ManageGuild)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Insufficient Permissions")
              .setDescription(
                `You need the \`Manage Server\` permission in order to change the server prefix!`,
              ),
          ],
        });
      }

      const newPrefix = args[1];

      if (!newPrefix) {
        return message.reply("Please provide a new prefix.");
      } else if (newPrefix.length > 5) {
        return message.reply(
          "The new prefix cannot exceed 5 charaters in length!",
        );
      }

      await Server.findOneAndUpdate(
        { serverId: message.guildId },
        { $set: { prefix: newPrefix } },
        { returnDocument: "after", upsert: true },
      );

      return message.reply(`Prefix updated to \`${newPrefix}\``);
    } else {
      message.reply("Invaild argument.");
    }
  },
};
