import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";
import {
  authMiddleware,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { availableUserRoles, userRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(authMiddleware);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(validateProjectPermission(availableUserRoles), getProjectById)
  .put(
    validateProjectPermission([userRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjectPermission([userRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([userRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validateProjectPermission([userRolesEnum.ADMIN]), updateMemberRole)
  .delete(validateProjectPermission([userRolesEnum.ADMIN]), deleteMember);

export default router;
