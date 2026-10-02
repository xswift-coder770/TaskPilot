import React from "react";
import { Trash2, Edit2, FileText } from "lucide-react";
import { formatDate } from "../../utils/helpers";

export const NoteCard = ({ note, onEdit, onDelete, canManageNote }) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {note.title}
            </h4>
          </div>
          {canManageNote && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(note)}
                className="rounded p-1 text-slate-400 hover:text-indigo-600"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                className="rounded p-1 text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-400 line-clamp-4">
          {note.content}
        </p>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
        Updated {formatDate(note.updatedAt || note.createdAt)}
      </div>
    </div>
  );
};