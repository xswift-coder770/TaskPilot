import React, { useState, useEffect } from "react";
import { X, UserPlus, Shield, Trash2, Mail } from "lucide-react";
import { projectApi } from "../../api/projectApi";
import { Button } from "../common/Button";
import { Loader } from "../common/Loader";
import { getErrorMessage } from "../../utils/helpers";

export const MemberModal = ({
  isOpen,
  onClose,
  projectId,
  isProjectAdmin = true,
}) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await projectApi.getProjectMembers(projectId);
      setMembers(res.data?.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setEmail("");
      setError("");
    }
  }, [isOpen, projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");
    try {
      await projectApi.addMember(projectId, {
        email: email.trim(),
        role: role.toLowerCase(),
      });
      setEmail("");
      await fetchMembers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!userId) return;
    try {
      await projectApi.updateMemberRole(projectId, userId, newRole);
      await fetchMembers();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!userId) {
      alert("Invalid User ID");
      return;
    }
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await projectApi.deleteMember(projectId, userId);
      setMembers((prev) =>
        prev.filter((m) => (m.user?._id || m.user) !== userId)
      );
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Project Members
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Invite Form */}
        {isProjectAdmin && (
          <form onSubmit={handleAddMember} className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Invite Collaborator
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="collaborator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="member">Member</option>
                <option value="project_admin">Project Admin</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" size="sm" loading={isSubmitting} icon={UserPlus}>
                Invite
              </Button>
            </div>
          </form>
        )}

        {/* Members List */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Members ({members.length})
          </p>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {isLoading ? (
              <Loader text="Loading members..." />
            ) : members.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                No members in this project yet.
              </p>
            ) : (
              members.map((item, index) => {
                const u = item.user || {};
                const targetUserId = u._id || item.user;
                const displayName = u.fullName || u.username || "Member";
                const displayHandle = u.username || (u.email ? u.email.split("@")[0] : "user");
                const currentRole = (item.role || "member").toLowerCase();

                return (
                  <div
                    key={targetUserId || index}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-xs text-white uppercase shadow-xs">
                        {displayName.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {displayName}
                        </p>
                        <p className="text-[11px] text-slate-400">@{displayHandle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isProjectAdmin ? (
                        <select
                          value={currentRole}
                          onChange={(e) =>
                            handleRoleChange(targetUserId, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 capitalize"
                        >
                          <option value="member">Member</option>
                          <option value="project_admin">Project Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {currentRole.replace("_", " ")}
                        </span>
                      )}

                      {isProjectAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(targetUserId)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 cursor-pointer transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;