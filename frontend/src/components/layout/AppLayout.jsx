import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon, Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Dropdown } from "../common/Dropdown";
import { Avatar } from "../common/Avatar";
import { projectApi } from "../../api/projectApi";
import { BrandLogo } from "../common/BrandLogo";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch active projects for sidebar quick navigation
  useEffect(() => {
    const fetchSidebarProjects = async () => {
      try {
        const res = await projectApi.getProjects();
        const list = res.data?.data || [];
        const normalized = list.map((item) =>
          item.project && typeof item.project === "object" ? item.project : item
        );
        setProjects(normalized);
      } catch (err) {
        console.error("Could not fetch projects for sidebar", err);
      }
    };

    fetchSidebarProjects();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      label: `@${user?.username || "user"}`,
      disabled: true,
    },
    { divider: true },
    {
      label: "Sign out",
      icon: LogOut,
      variant: "danger",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
          {/* Left: Mobile Sidebar Trigger & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <BrandLogo to="/dashboard" />
          </div>

          {/* Right: Theme Toggle & User Avatar Dropdown */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile Avatar Dropdown */}
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="flex items-center rounded-full transition-transform hover:scale-105 focus:outline-none cursor-pointer"
                  aria-label="User profile menu"
                >
                  <Avatar user={user} size="md" />
                </button>
              }
              items={userMenuItems}
            />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;