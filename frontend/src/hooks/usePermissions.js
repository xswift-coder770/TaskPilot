import { useMemo } from "react";
import { UserRolesEnum } from "../utils/constants";

/**
 * Hook to compute action permissions based on the active user's project role.
 * Matches backend's validateProjectPermission matrix.
 *
 * @param {string} role - The current user's role in the active project ('admin' | 'project_admin' | 'member')
 */
export const usePermissions = (role) => {
  return useMemo(() => {
    const isAdmin = role === UserRolesEnum.ADMIN;
    const isProjectAdmin = role === UserRolesEnum.PROJECT_ADMIN;
    const isMember = role === UserRolesEnum.MEMBER;

    return {
      role,
      isAdmin,
      isProjectAdmin,
      isMember,

      // Project-level actions (Admin only)
      canUpdateProject: isAdmin,
      canDeleteProject: isAdmin,
      canManageMembers: isAdmin,

      // Task actions (Admin & Project Admin)
      canCreateTask: isAdmin || isProjectAdmin,
      canUpdateTask: isAdmin || isProjectAdmin,
      canDeleteTask: isAdmin || isProjectAdmin,

      // Subtask actions
      canCreateSubtask: isAdmin || isProjectAdmin,
      canDeleteSubtask: isAdmin || isProjectAdmin,
      canToggleSubtask: isAdmin || isProjectAdmin || isMember,

      // Notes actions
      canCreateNote: isAdmin,
      canUpdateNote: isAdmin,
      canDeleteNote: isAdmin,
      canViewNotes: isAdmin || isProjectAdmin || isMember,
    };
  }, [role]);
};

export default usePermissions;
