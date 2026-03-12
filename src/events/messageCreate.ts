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

      if (
        message.channel?.id === server.countingChannel &&
        server.countingEnabled
      ) {
        if (message.author.id === client.user?.id) return;
        if (server.countingMember === message.author.id) {
          if (server.countingReset) {
            message.react(encodeURI("❌"));
            message.channel?.send({
              content: `<@${message.author.id}> **RUINED** IT AT ${server.countingNumber}!! Next number is **1**.\nTypeError: \`You can't count two numbers in a row.\``,
            });
            server.countingNumber = 0;
            server.countingMember = client.user?.id;
            await server.save();
          } else {
            message.delete().catch(() => {
              message.channel?.send({
                content: `I am missing the permission \`ManageMessages\` please add that to my role(s) so I can work properly!`,
              });
            });

            message.channel
              ?.send({
                content: `<@${message.author.id}>, it's not your turn, please let someone else go next!`,
              })
              .then((msg) => {
                setTimeout(
                  () =>
                    msg.delete().catch(() => {
                      message.channel?.send({
                        content: `I am missing the permission \`ManageMessages\` please add that to my role(s) so I can work properly!`,
                      });
                    }),
                  5000,
                );
              });
          }
          return;
        }
        let number = server.countingNumber + 1;
        if (message.content.includes(number.toString())) {
          server.countingNumber = server.countingNumber + 1;
          server.countingMember = message.author.id;
          await server.save();
          message.react(encodeURI("✅"));
        } else {
          if (server.countingReset) {
            message.react(encodeURI("❌"));
            message.channel?.send({
              content: `<@${message.author.id}> **ruined** it at ${server.countingNumber}! Next number is 1.\nTypeError: \`Wrong Number\``,
            });
            server.countingNumber = 0;
            server.countingMember = client.user?.id;
            await server.save();
          } else {
            message.delete();
            return message.channel
              ?.send({
                content: `<@${message.author.id}>, that was the wrong number!\nPlease continue with the correct number: **${server.countingNumber + 1}**`,
              })
              .then((msg) => {
                setTimeout(() => msg.delete(), 5000);
              });
          }
        }
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
