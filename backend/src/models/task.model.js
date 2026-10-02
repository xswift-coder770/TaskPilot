import mongoose, { Schema } from "mongoose";
import { availableTaskStatus, taskStatusEnum } from "../utils/constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    taskStatus: {
      type: String,
      enum: availableTaskStatus,
      default: taskStatusEnum.TODO,
    },
    attachments: {
      type: [
        {
          url: String,
          MimeTypeArray: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", taskSchema);
