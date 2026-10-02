import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Kanban,
  FileText,
  Plus,
  AlertCircle,
  FolderKanban,
} from "lucide-react";
import { projectApi } from "../api/projectApi";
import { taskApi } from "../api/taskApi";
import { noteApi } from "../api/noteApi";
import { usePermissions } from "../hooks/usePermissions";
import { RoleBadges, UserRolesEnum } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { Avatar } from "../components/common/Avatar";

// Modals & Panels
import { TaskBoard } from "../components/tasks/TaskBoard";
import { TaskModal } from "../components/tasks/TaskModal";
import { TaskDetailModal } from "../components/tasks/TaskDetailModal";
import { MemberModal } from "../components/projects/MemberModal";
import { NoteCard } from "../components/notes/NoteCard";
import { NoteModal } from "../components/notes/NoteModal";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("board"); // 'board' | 'notes'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Load project, members, tasks, and notes
  const loadWorkspace = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [projRes, membersRes, tasksRes, notesRes] = await Promise.all([
        projectApi.getProjectById(projectId),
        projectApi.getProjectMembers(projectId).catch(() => ({ data: { data: [] } })),
        taskApi.getTasks(projectId).catch(() => ({ data: { data: [] } })),
        noteApi.getNotes(projectId).catch(() => ({ data: { data: [] } })),
      ]);
      setProject(projRes.data?.data || null);
      setMembers(membersRes.data?.data || []);
      setTasks(tasksRes.data?.data || []);
      setNotes(notesRes.data?.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMembers = async () => {
    try {
      const res = await projectApi.getProjectMembers(projectId);
      setMembers(res.data?.data || []);
    } catch (err) {
      console.error("Could not refresh members:", err);
    }
  };

  useEffect(() => {
    if (projectId) loadWorkspace();
  }, [projectId]);

  const userRole =
    project?.currentUserRole || project?.role || UserRolesEnum.ADMIN;
  const {
    canCreateTask,
    canUpdateTask,
    canDeleteTask,
    canCreateNote,
    canUpdateNote,
    canDeleteNote,
    canManageMembers,
    canToggleSubtask,
  } = usePermissions(userRole);

  const roleConfig = RoleBadges[userRole] || RoleBadges[UserRolesEnum.ADMIN];

  // Members Avatar Stack calculations
  const maxVisibleMembers = 4;
  const visibleMembers = members.slice(0, maxVisibleMembers);
  const extraMembersCount = members.length - maxVisibleMembers;

  // Task Handlers
  const handleTaskCardClick = async (task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);

    try {
      const res = await taskApi.getTaskById(projectId, task._id || task.id);
      if (res.data?.data) {
        setSelectedTask(res.data.data);
        setTasks((prev) =>
          prev.map((t) =>
            (t._id || t.id) === (task._id || task.id) ? res.data.data : t
          )
        );
      }
    } catch (err) {
      console.error("Could not fetch detailed task:", err);
    }
  };

  const handleTaskSaved = (savedTask) => {
    setTasks((prev) => {
      const exists = prev.some(
        (t) => (t._id || t.id) === (savedTask._id || savedTask.id)
      );
      return exists
        ? prev.map((t) =>
            (t._id || t.id) === (savedTask._id || savedTask.id) ? savedTask : t
          )
        : [savedTask, ...prev];
    });
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) =>
        (t._id || t.id) === (updatedTask._id || updatedTask.id)
          ? updatedTask
          : t
      )
    );
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await taskApi.deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // Note Handlers
  const handleNoteSaved = (savedNote) => {
    setNotes((prev) => {
      const exists = prev.some(
        (n) => (n._id || n.id) === (savedNote._id || savedNote.id)
      );
      return exists
        ? prev.map((n) =>
            (n._id || n.id) === (savedNote._id || savedNote.id) ? savedNote : n
          )
        : [savedNote, ...prev];
    });
  };

  const handleNoteDeleted = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await noteApi.deleteNote(projectId, noteId);
      setNotes((prev) => prev.filter((n) => (n._id || n.id) !== noteId));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading) return <Loader text="Loading workspace details..." />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/30">
        <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
        <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
          {error || "Project workspace not found"}
        </p>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="sm"
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {project.name}
            </h1>
            <span
              className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${roleConfig.className}`}
            >
              {roleConfig.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Action Buttons & Member Stack */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Members Stack */}
          {members.length > 0 && (
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              title="View & manage active members"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-2.5 py-1.5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 cursor-pointer"
            >
              <div className="flex -space-x-2 overflow-hidden">
                {visibleMembers.map((member, index) => {
                  const targetUser = member.user || member;
                  return (
                    <Avatar
                      key={targetUser._id || targetUser.id || index}
                      user={targetUser}
                      size="xs"
                      className="ring-2 ring-white dark:ring-slate-900"
                    />
                  );
                })}
              </div>

              {extraMembersCount > 0 ? (
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  +{extraMembersCount}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {members.length} {members.length === 1 ? "member" : "members"}
                </span>
              )}
            </button>
          )}

          {activeTab === "board" && canCreateTask && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
          )}

          {activeTab === "notes" && canCreateNote && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setSelectedNote(null);
                setIsNoteModalOpen(true);
              }}
            >
              Add Note
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={Users}
            onClick={() => setIsMemberModalOpen(true)}
          >
            Manage Members
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("board")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "board"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Kanban className="h-4 w-4" />
          <span>Task Board</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "notes"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Project Notes</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "board" && (
        <TaskBoard
          tasks={tasks}
          onTaskClick={handleTaskCardClick}
          onAddTask={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
          canCreateTask={canCreateTask}
        />
      )}

      {activeTab === "notes" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <FileText className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                No Notes Yet
              </p>
              <p className="text-xs text-slate-400">
                Add documentation or guidelines for your team.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note._id || note.id}
                note={note}
                canManageNote={canUpdateNote || canDeleteNote}
                onEdit={(n) => {
                  setSelectedNote(n);
                  setIsNoteModalOpen(true);
                }}
                onDelete={handleNoteDeleted}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        taskToEdit={selectedTask}
        onSaved={handleTaskSaved}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        projectId={projectId}
        task={selectedTask}
        onUpdateTask={handleTaskUpdated}
        onDeleteTask={handleTaskDeleted}
        canEdit={canUpdateTask || canDeleteTask}
        canToggle={canToggleSubtask}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        projectId={projectId}
        noteToEdit={selectedNote}
        onSaved={handleNoteSaved}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          refreshMembers();
        }}
        projectId={projectId}
        isProjectAdmin={canManageMembers}
      />
    </div>
  );
}