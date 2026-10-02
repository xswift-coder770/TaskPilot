import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { authMiddleware, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { availableUserRoles, userRolesEnum } from "../utils/constants.js";
import {
  createNoteValidator,
  updateNoteValidator,
} from "../validators/index.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controller.js";

const router = Router();
router.use(authMiddleware);

router
  .route("/:projectId")
  .get(validateProjectPermission(availableUserRoles), getNotes)
  .post(
    validateProjectPermission([userRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(availableUserRoles), getNoteById)
  .put(
    validateProjectPermission([userRolesEnum.ADMIN]),
    updateNoteValidator(),
    validate,
    updateNote,
  )
  .delete(validateProjectPermission([userRolesEnum.ADMIN]), deleteNote);

export default router;
