import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Paperclip,
  ExternalLink,
  Calendar,
  User,
  Trash,
} from "lucide-react";
import { taskApi } from "../../api/taskApi";
import { Button } from "../common/Button";
import { formatDate, getErrorMessage } from "../../utils/helpers";

export const TaskDetailModal = ({
  isOpen,
  onClose,
  projectId,
  task,
  onUpdateTask,
  onDeleteTask,
  canEdit = true,
  canToggle = true,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !task) return null;

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const attachments = Array.isArray(task.attachments) ? task.attachments : [];

  // Normalize status string for UI comparison
  const rawStatus = (task.status || "todo").toString();
  const currentStatus = rawStatus.toLowerCase().replace("-", "_").trim();

  // Move status handler (handles TODO, IN_PROGRESS, DONE)
  const handleStatusChange = async (targetKey) => {
    setIsChangingStatus(true);
    try {
      const formData = new FormData();
      formData.append("title", task.title || "");
      formData.append("description", task.description || "");

      // Send the status string (checking if original schema was uppercase or lowercase)
      const isOriginalUppercase = rawStatus === rawStatus.toUpperCase();
      const formattedStatus = isOriginalUppercase
        ? targetKey.toUpperCase()
        : targetKey.toLowerCase();

      formData.append("status", formattedStatus);

      const res = await taskApi.updateTask(
        projectId,
        task._id || task.id,
        formData
      );

      const updatedData = res.data?.data || {};

      // Merge response while strictly preserving local subtasks & attachments
      const fullUpdatedTask = {
        ...task,
        ...updatedData,
        status: updatedData.status || formattedStatus,
        subtasks: task.subtasks || [],
        attachments: updatedData.attachments || task.attachments || [],
      };

      onUpdateTask(fullUpdatedTask);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(getErrorMessage(err));
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (subtask) => {
    if (!canToggle) return;
    try {
      const res = await taskApi.updateSubtask(projectId, subtask._id, {
        isCompleted: !subtask.isCompleted,
      });
      const updatedSubtask = res.data?.data;
      const updatedList = subtasks.map((s) =>
        s._id === subtask._id ? updatedSubtask : s
      );
      onUpdateTask({ ...task, subtasks: updatedList });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // Add new subtask
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;

    setIsAddingSubtask(true);
    setError("");
    try {
      const res = await taskApi.createSubtask(projectId, task._id || task.id, {
        title: subtaskTitle.trim(),
      });
      const newSubtask = res.data?.data;
      onUpdateTask({
        ...task,
        subtasks: [...subtasks, newSubtask],
      });
      setSubtaskTitle("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // Delete subtask
  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await taskApi.deleteSubtask(projectId, subtaskId);
      onUpdateTask({
        ...task,
        subtasks: subtasks.filter((s) => s._id !== subtaskId),
      });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const statusOptions = [
    { key: "todo", label: "Todo" },
    { key: "in_progress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="space-y-1">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {currentStatus.replace("_", " ")}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {task.title || "Untitled Task"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Details Info Bar & Status Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Created {task.createdAt ? formatDate(task.createdAt) : "Recently"}
              </span>
            </div>

            {task.assignedTo && (
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                <span>@{task.assignedTo.username || "user"}</span>
              </div>
            )}
          </div>

          {/* Move to status buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">
              Move to:
            </span>
            {statusOptions.map((st) => (
              <button
                key={st.key}
                type="button"
                disabled={isChangingStatus}
                onClick={() => handleStatusChange(st.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-all cursor-pointer disabled:opacity-50 ${
                  currentStatus === st.key
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {task.description || "No description provided for this task."}
          </p>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Paperclip className="h-3.5 w-3.5" />
              Attachments ({attachments.length})
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {attachments.map((att, idx) => (
                <div
                  key={att._id || idx}
                  className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950"
                >
                  <img
                    src={att.url}
                    alt="Task Attachment"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = "flex";
                      }
                    }}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <div
                    style={{ display: "none" }}
                    className="h-24 w-full flex-col items-center justify-center text-slate-400"
                  >
                    <Paperclip className="h-6 w-6" />
                    <span className="text-[10px] mt-1">Attachment</span>
                  </div>

                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Open file <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtasks Section */}
        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subtasks ({subtasks.filter((s) => s?.isCompleted).length}/
            {subtasks.length})
          </h4>

          {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {subtasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No subtasks added yet.
              </p>
            ) : (
              subtasks.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(sub)}
                    className="flex items-center gap-2.5 font-medium cursor-pointer text-left"
                  >
                    {sub.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        sub.isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-200"
                      }
                    >
                      {sub.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub._id)}
                    className="rounded p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Delete subtask"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddSubtask} className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Add new subtask item..."
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isAddingSubtask}
              icon={Plus}
            >
              Add
            </Button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button
            variant="danger"
            size="sm"
            icon={Trash}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this task?")
              ) {
                onDeleteTask(task._id || task.id);
                onClose();
              }
            }}
          >
            Delete Task
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;