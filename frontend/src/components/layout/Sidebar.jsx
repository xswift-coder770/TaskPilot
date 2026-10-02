import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BrandMark } from "../common/BrandLogo";
import { APP_NAME } from "../../utils/constants";

export const Sidebar = ({ isOpen, onClose, projects = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      end: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:static ${
          isCollapsed ? "md:w-16" : "md:w-64"
        } ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800 md:hidden">
          <div className="flex items-center gap-2">
            <BrandMark className="h-7 w-7" />
            <span className="font-bold text-slate-900 dark:text-white">{APP_NAME}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <div className="hidden md:flex items-center justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Workspace
              </p>
            )}

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    } ${isCollapsed ? "justify-center px-2" : ""}`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Tooltip on collapse */}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full ml-3 hidden rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-md group-hover:block dark:bg-slate-800 z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Workspaces Navigation */}
          {projects.length > 0 && (
            <div className="space-y-1">
              {!isCollapsed ? (
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Active Projects
                </p>
              ) : (
                <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
              )}

              {projects.slice(0, 8).map((project) => (
                <NavLink
                  key={project._id || project.id}
                  to={`/projects/${project._id || project.id}`}
                  onClick={onClose}
                  title={isCollapsed ? project.name || "Untitled" : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                    } ${isCollapsed ? "justify-center px-2" : ""}`
                  }
                >
                  <FolderKanban className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  {!isCollapsed && (
                    <span className="truncate">{project.name || "Untitled"}</span>
                  )}

                  {/* Tooltip on collapse */}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full ml-3 hidden rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-md group-hover:block dark:bg-slate-800 z-50 whitespace-nowrap">
                      {project.name || "Untitled"}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* API Status Footer */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div
            title={`${APP_NAME} API Connected`}
            className={`flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            {!isCollapsed && <span className="font-medium truncate">API Connected</span>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;