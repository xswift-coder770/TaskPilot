import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controller.js";
import { authMiddleware, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { availableUserRoles, userRolesEnum } from "../utils/constants.js";
import {
  createTaskValidator,
  updateTaskValidator,
  createSubtaskValidator,
  updateSubtaskValidator,
} from "../validators/index.js";

const router = Router();
router.use(authMiddleware);

router
  .route("/:projectId")
  .get(validateProjectPermission(availableUserRoles), getTasks)
  .post(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    upload.array("attachments"),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission(availableUserRoles), getTaskById)
  .put(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    upload.array("attachments"),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    createSubtaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/st/:subtaskId")
  .put(validateProjectPermission(availableUserRoles), updateSubtaskValidator(), validate, updateSubTask)
  .delete(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    deleteSubTask,
  );

export default router;
