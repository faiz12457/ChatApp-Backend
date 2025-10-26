import { Schema, model } from "mongoose";

const requestSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Request = model("request", requestSchema);
