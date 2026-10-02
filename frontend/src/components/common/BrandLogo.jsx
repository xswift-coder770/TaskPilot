import React from "react";
import { Link } from "react-router-dom";

export function BrandMark({ className = "h-9 w-9" }) {
  const gradientId = React.useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <path
        d="M11 20.5L17.2 26.5L29.5 13.5"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 22.5L30.2 24.2L27.5 29"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function BrandWordmark({ className = "" }) {
  return (
    <span
      className={`text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white ${className}`}
    >
      Task
      <span className="text-teal-600 dark:text-teal-400">Pilot</span>
    </span>
  );
}

export function BrandLogo({
  to = "/",
  className = "",
  showWordmark = true,
  markClassName = "h-9 w-9",
}) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandMark className={markClassName} />
      {showWordmark ? <BrandWordmark /> : null}
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} aria-label="TaskPilot" className="inline-flex items-center">
      {content}
    </Link>
  );
}

export default BrandLogo;
