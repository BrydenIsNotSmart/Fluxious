export const botToken = Bun.env.BOT_TOKEN;
export const defaultPrefix = Bun.env.DEFAULT_PREFIX || "!";
export const apiURL = Bun.env.API_URL || "api.fluxer.app";
export const dbURL = Bun.env.DB_URL;
export const embedColor = Bun.env.EMBED_COLOR || "#4640d8";

if (!botToken) {
  throw new Error("BOT_TOKEN environment variable is required");
}
