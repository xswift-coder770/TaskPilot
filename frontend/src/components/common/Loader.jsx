import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs dark:bg-slate-950/80">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        {text && (
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      {text && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;