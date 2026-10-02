import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Layers,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Dropdown } from "../common/Dropdown";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

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
      label: "My Projects",
      icon: Layers,
      onClick: () => navigate("/dashboard"),
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      {/* Left: Mobile Sidebar Trigger & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <BrandLogo to="/" className="mb-2" />
      </div>

      {/* Right: Theme Toggle & Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Toggle */}
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
              className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition-all hover:ring-indigo-500/30 focus:outline-none cursor-pointer"
            >
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.username || "User avatar"}
                  className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800">
                  {user?.fullName?.[0]?.toUpperCase() ||
                    user?.username?.[0]?.toUpperCase() || (
                      <UserIcon className="h-4 w-4" />
                    )}
                </div>
              )}
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};

export default Navbar;
