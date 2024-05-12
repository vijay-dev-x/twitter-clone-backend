import mongoose, { Schema } from "mongoose";
const tweetScema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    userDetails: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);
export const tweetModel = mongoose.model("tweet", tweetScema);
