import type { Message } from "@fluxerjs/core";

export async function getMemberPerms(message: Message) {
  const guild =
    message.guild ?? (await message.client.guilds.resolve(message.guildId!));
  if (!guild) return null;
  const member =
    guild.members.get(message.author.id) ??
    (await guild.fetchMember(message.author.id));
  return member?.permissions ?? null;
}
