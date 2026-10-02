import React from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../components/common/BrandLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <BrandLogo to="/" />
      <h1 className="text-4xl font-extrabold text-teal-600">404</h1>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This TaskPilot route does not exist.
      </p>
      <Link
        to="/dashboard"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
