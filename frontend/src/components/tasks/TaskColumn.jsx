import React from "react";
import { Plus, Circle, Clock, CheckCircle2 } from "lucide-react";
import { TaskCard } from "./TaskCard";

export const TaskColumn = ({
  title,
  statusKey,
  tasks = [],
  onTaskClick,
  onAddTask,
  canCreateTask,
}) => {
  const configs = {
    todo: {
      dot: "bg-slate-400",
      badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      border: "border-slate-200 dark:border-slate-800/60",
      icon: Circle,
    },
    in_progress: {
      dot: "bg-amber-500",
      badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
      border: "border-amber-200/50 dark:border-amber-900/30",
      icon: Clock,
    },
    done: {
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
      border: "border-emerald-200/50 dark:border-emerald-900/30",
      icon: CheckCircle2,
    },
  };

  const config = configs[statusKey] || configs.todo;
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${statusKey === 'in_progress' ? 'text-amber-500' : statusKey === 'done' ? 'text-emerald-500' : 'text-slate-400'}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            {title}
          </h3>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${config.badge}`}>
            {tasks.length}
          </span>
        </div>

        {canCreateTask && (
          <button
            type="button"
            onClick={() => onAddTask(statusKey)}
            title={`Add task to ${title}`}
            className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-xs dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tasks Stack */}
      <div className="mt-2 space-y-3 flex-1 min-h-50">
        {tasks.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-center dark:border-slate-800/80">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No tasks in {title.toLowerCase()}
            </p>
            {canCreateTask && (
              <button
                type="button"
                onClick={() => onAddTask(statusKey)}
                className="mt-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                + Create task
              </button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id || task.id} task={task} onClick={onTaskClick} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;