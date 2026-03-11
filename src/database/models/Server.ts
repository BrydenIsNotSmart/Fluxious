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

  countingChannel: {
    type: String,
    default: null,
  },
  countingEnabled: {
    type: Boolean,
    default: false,
  },
  countingNumber: {
    type: Number,
    default: 0,
  },
  countingMember: {
    type: String,
    default: null,
  },
  countingReset: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Server", guildSchema);
