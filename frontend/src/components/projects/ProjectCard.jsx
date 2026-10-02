import React from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { Dropdown } from "../common/Dropdown";
import { formatDate } from "../../utils/helpers";
import { RoleBadges, UserRolesEnum } from "../../utils/constants";
import { usePermissions } from "../../hooks/usePermissions";

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  const projectId = project?._id || project?.id;
  const userRole = project?.currentUserRole || project?.role || UserRolesEnum.ADMIN;
  const { canUpdateProject, canDeleteProject } = usePermissions(userRole);

  const menuItems = [
    ...(canUpdateProject
      ? [
          {
            label: "Edit Project",
            icon: Edit2,
            onClick: () => onEdit(project),
          },
        ]
      : []),
    ...(canDeleteProject
      ? [
          { divider: true },
          {
            label: "Delete Project",
            icon: Trash2,
            variant: "danger",
            onClick: () => {
              if (projectId) onDelete(projectId);
            },
          },
        ]
      : []),
  ];

  const roleConfig = RoleBadges[userRole] || RoleBadges[UserRolesEnum.ADMIN];

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Header with Title and Dropdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 shadow-xs">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <Link
                to={`/projects/${projectId}`}
                className="group/link flex items-center gap-1 font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors text-base"
              >
                <span className="line-clamp-1">{project.name || "Untitled Workspace"}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </Link>
              <div className="mt-1">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${roleConfig.className}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>

          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                aria-label="Project actions"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            }
            items={menuItems}
          />
        </div>

        {/* Project Description */}
        <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-8">
          {project.description || "No description provided for this workspace."}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Users className="h-3.5 w-3.5 text-indigo-500" />
          <span>
            {project.membersCount || 1} {project.membersCount === 1 ? "Member" : "Members"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{project.createdAt ? formatDate(project.createdAt) : "Recently"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;