import { botToken } from "../config";
import type { FluxerClient } from "../types/client";

export function setupReconnect(client: FluxerClient) {
  const reconnect = async () => {
    console.log(`[Gateway] Attempting reconnect...`);

    try {
      await client.destroy();
      await client.login(botToken!);
      console.log(`[Gateway] Reconnected successfully.`);
    } catch (err) {
      console.log(`[Gateway] Reconnect failed:`, err);
      setTimeout(reconnect, 5000);
    }
  };

  client.on("error", (err) => {
    console.log(`[Gateway] Fluxer client error:`, err);
    reconnect();
  });

  client.on("disconnect", (code) => {
    console.log(`[Gateway] Disconnected with code ${code}. Reconnecting...`);
    reconnect();
  });
}
