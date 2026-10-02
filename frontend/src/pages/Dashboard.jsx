import React, { useState, useEffect, useMemo } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Users,
  Plus,
  Search,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { projectApi } from "../api/projectApi";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectModal } from "../components/projects/ProjectModal";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { getErrorMessage } from "../utils/helpers";
import { UserRolesEnum } from "../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [rawProjects, setRawProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await projectApi.getProjects();
      const list = response.data.data || [];
      // Normalize whether backend returns flat or nested aggregate `{ project: {...}, role }`
      const normalized = list.map((item) => {
        if (item.project && typeof item.project === "object") {
          return {
            ...item.project,
            currentUserRole: item.role || item.currentUserRole || UserRolesEnum.MEMBER,
            membersCount: item.project.members || item.project.membersCount || 1,
          };
        }
        return {
          ...item,
          currentUserRole: item.currentUserRole || item.role || UserRolesEnum.ADMIN,
          membersCount: item.membersCount || item.members?.length || 1,
        };
      });
      setRawProjects(normalized);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSaved = (savedProject) => {
    const formatted = {
      ...(savedProject.project || savedProject),
      currentUserRole: savedProject.role || savedProject.currentUserRole || UserRolesEnum.ADMIN,
      membersCount: savedProject.membersCount || 1,
    };

    setRawProjects((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === (formatted._id || formatted.id));
      if (exists) {
        return prev.map((p) =>
          (p._id || p.id) === (formatted._id || formatted.id) ? formatted : p
        );
      }
      return [formatted, ...prev];
    });
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId) return;
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await projectApi.deleteProject(projectId);
      setRawProjects((prev) => prev.filter((p) => (p._id || p.id) !== projectId));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalProjects = rawProjects.length;
    const adminCount = rawProjects.filter(
      (p) => (p.currentUserRole || p.role) === UserRolesEnum.ADMIN
    ).length;
    const memberCount = rawProjects.filter(
      (p) => (p.currentUserRole || p.role) === UserRolesEnum.MEMBER
    ).length;

    return { totalProjects, adminCount, memberCount };
  }, [rawProjects]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return rawProjects.filter((project) => {
      const name = project.name || "";
      const desc = project.description || "";
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const currentRole = project.currentUserRole || project.role || UserRolesEnum.MEMBER;
      const matchesRole = roleFilter === "all" || currentRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [rawProjects, searchQuery, roleFilter]);

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back, {user?.fullName || user?.username}!
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor active project workspaces, track role access, and assign tasks in TaskPilot.
          </p>
        </div>

        {/* Hidden when viewing the Member tab */}
        {roleFilter !== UserRolesEnum.MEMBER && (
          <Button
            onClick={handleOpenCreateModal}
            variant="primary"
            icon={Plus}
            className="self-start sm:self-auto"
          >
            Create Project
          </Button>
        )}
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Workspaces
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.totalProjects}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Admin Access
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.adminCount}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Member Roles
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {metrics.memberCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="project-search"
            name="projectSearch"
            type="text"
            aria-label="Search workspaces"
            placeholder="Search workspaces by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", UserRolesEnum.ADMIN, UserRolesEnum.MEMBER].map((roleKey) => (
            <button
              key={roleKey}
              type="button"
              onClick={() => setRoleFilter(roleKey)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                roleFilter === roleKey
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {roleKey === "all" ? "All Roles" : roleKey}
            </button>
          ))}
        </div>
      </div>

      {/* Workspaces Grid */}
      {isLoading ? (
        <Loader text="Loading your workspaces..." />
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/30">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{error}</p>
          <Button onClick={fetchProjects} variant="secondary" size="sm" className="mt-4">
            Retry Connection
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            {roleFilter === UserRolesEnum.MEMBER
              ? "No member workspaces"
              : "No workspaces found"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {searchQuery
              ? "No workspace matches your current search criteria."
              : roleFilter === UserRolesEnum.MEMBER
              ? "You haven't been added to any workspaces as a member yet."
              : "Get started by creating your first project workspace."}
          </p>
          {!searchQuery && roleFilter !== UserRolesEnum.MEMBER && (
            <Button
              onClick={handleOpenCreateModal}
              variant="primary"
              size="sm"
              icon={Plus}
              className="mt-4"
            >
              Create Workspace
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={selectedProject}
        onSaved={handleProjectSaved}
      />
    </div>
  );
}