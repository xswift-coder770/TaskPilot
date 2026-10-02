import React from "react";
import {
  CheckSquare,
  Paperclip,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

export const TaskCard = ({ task, onClick }) => {
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;
  const totalSubtasks = subtasks.length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const statusNormalized = (task.status || "todo").toLowerCase();

  return (
    <div
      onClick={() => onClick(task)}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 cursor-pointer"
    >
      <div>
        {/* Title and Assignee */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h4>
          {task.assignedTo && (
            <div
              title={`Assigned to @${task.assignedTo.username || "user"}`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ring-1 ring-indigo-500/20"
            >
              {task.assignedTo.username ? task.assignedTo.username.slice(0, 2).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Subtask Progress Bar (if subtasks exist) */}
        {totalSubtasks > 0 && (
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3 text-indigo-500" />
                Subtasks
              </span>
              <span>
                {completedSubtasks}/{totalSubtasks} ({progressPercent}%)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100
                    ? "bg-emerald-500"
                    : progressPercent > 0
                    ? "bg-indigo-600"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Badges */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          {task.attachments?.length > 0 && (
            <span
              className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              title={`${task.attachments.length} attachment(s)`}
            >
              <Paperclip className="h-3 w-3" />
              <span>{task.attachments.length}</span>
            </span>
          )}

          {totalSubtasks === 0 && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Layers className="h-3 w-3" />
              0 Subtasks
            </span>
          )}
        </div>

        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="h-3 w-3" />
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;