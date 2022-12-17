const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    votes: {
      type: Number,
      default: 0,
      required: [false, "Please add a number of votes"],
    },
    slogan: {
      type: String,
    },
    party: {
      type: String,
      required: [true, "Please add a party"],
      enum: ["Democrat", "Republican", "Independent"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
