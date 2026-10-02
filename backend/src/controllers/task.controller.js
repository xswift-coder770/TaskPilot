import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import asyncHandler from "../utils/async.handler.js";
import mongoose from "mongoose";
import { availableUserRoles, userRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => ({
    // Use file.filename instead of file.originalname
    url: `${process.env.SERVER_URL || "http://localhost:5000"}/images/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});
const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});
const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  let task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task not found");

  const { title, description, assignedTo, status } = req.body;
  const files = req.files || [];

  const attachments = files.map((file) => ({
    // Use file.filename instead of file.originalname
    url: `${process.env.SERVER_URL || "http://localhost:5000"}/images/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const update = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(assignedTo !== undefined && {
      assignedTo: assignedTo
        ? new mongoose.Types.ObjectId(assignedTo)
        : undefined,
    }),
  };

  // if new attachments provided, append to existing
  if (attachments.length > 0) {
    update.attachments = [...(task.attachments || []), ...attachments];
  }

  task = await Task.findByIdAndUpdate(task._id, update, {
    returnDocument: "after",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});
const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const task = await Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task not found");

  // remove subtasks belonging to this task
  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(task._id) });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});
const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) throw new ApiError(404, "Task not found");

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(task._id),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});
const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subtaskId } = req.params;
  const { title, isCompleted } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const subtask = await Subtask.findById(
    new mongoose.Types.ObjectId(subtaskId),
  );
  if (!subtask) throw new ApiError(404, "Subtask not found");

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(subtask.task),
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) throw new ApiError(404, "Subtask not found");

  const update = {
    ...(title !== undefined && { title }),
    ...(isCompleted !== undefined && { isCompleted }),
  };

  const updatedSubtask = await Subtask.findByIdAndUpdate(subtask._id, update, {
    returnDocument: "after",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubtask, "Subtask updated successfully"));
});
const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, subtaskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const subtask = await Subtask.findById(
    new mongoose.Types.ObjectId(subtaskId),
  );
  if (!subtask) throw new ApiError(404, "Subtask not found");

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(subtask.task),
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) throw new ApiError(404, "Subtask not found");

  const deletedSubtask = await Subtask.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(subtaskId),
  });

  if (!deletedSubtask) throw new ApiError(404, "Subtask not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deletedSubtask, "Subtask deleted successfully"));
});

export {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
