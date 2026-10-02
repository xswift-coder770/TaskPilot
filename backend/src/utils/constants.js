export const userRolesEnum={
    ADMIN:"admin",
    PROJECT_MANAGER:"project_manager",
    MEMBER:"member",
};

export const availableUserRoles=Object.values(userRolesEnum);
//returns the array of user roles

export const taskStatusEnum={
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done",
};

export const availableTaskStatus=Object.values(taskStatusEnum);
//returns the array of available user roles

// Centralized Cookie Options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
};