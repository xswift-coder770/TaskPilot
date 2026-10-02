import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = "text",
      className = "",
      id,
      name,
      isLoading, // Intercepted so it doesn't spread into the DOM element
      loading,   // Intercepted so it doesn't spread into the DOM element
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const isBusy = Boolean(isLoading || loading);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled || isBusy}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
              : "border-slate-300 dark:border-slate-700"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;