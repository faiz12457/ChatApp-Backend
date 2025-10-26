import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },

    status: {
      type: String,
      default: "sending",
      enum: ["sending", "failed", "sent"],
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
    },

    attachments: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export const Message = model("message", messageSchema);
