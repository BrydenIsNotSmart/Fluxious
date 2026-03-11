import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
    unique: true,
  },

  prefix: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Server", guildSchema);
