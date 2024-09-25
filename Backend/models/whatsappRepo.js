const mongoose = require("mongoose");

const whatsappRepoSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    delivered: {
      type: Number,
      default: 0,
    },
    inbound: {
      type: Number,
      default: 0,
    },
    rebound: {
      type: Number,
      default: 0,
    },
    searchHistory: [String],
    seen: {
      type: Number,
      default: 0,
    },
    sent: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const WhatsappRepo = mongoose.model("whatsapp_repos", whatsappRepoSchema);

module.exports = WhatsappRepo;