import React from "react";
import { TaskColumn } from "./TaskColumn";

export const TaskBoard = ({ tasks = [], onTaskClick, onAddTask, canCreateTask }) => {
  // Normalize status matching regardless of backend format
  const normalizeStatus = (status) => {
    if (!status) return "todo";
    const s = status.toString().toLowerCase().replace("-", "_").trim();
    if (s === "in_progress" || s === "inprogress" || s === "in progress") return "in_progress";
    if (s === "done" || s === "completed") return "done";
    return "todo";
  };

  const todoTasks = tasks.filter((t) => normalizeStatus(t.status) === "todo");
  const inProgressTasks = tasks.filter((t) => normalizeStatus(t.status) === "in_progress");
  const doneTasks = tasks.filter((t) => normalizeStatus(t.status) === "done");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
      <TaskColumn
        title="To Do"
        statusKey="todo"
        tasks={todoTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        canCreateTask={canCreateTask}
      />
      <TaskColumn
        title="In Progress"
        statusKey="in_progress"
        tasks={inProgressTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        canCreateTask={canCreateTask}
      />
      <TaskColumn
        title="Completed"
        statusKey="done"
        tasks={doneTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        canCreateTask={canCreateTask}
      />
    </div>
  );
};

export default TaskBoard;