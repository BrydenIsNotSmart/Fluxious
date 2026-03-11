import { Client, Events } from "@fluxerjs/core";

export default {
  name: Events.Ready,
  once: true,
  execute(client: Client) {
    console.info(`[INFO] ${client.user?.username} is online and ready.`);
  },
};
