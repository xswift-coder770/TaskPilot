import { body, oneOf } from "express-validator";
import { availableTaskStatus, availableUserRoles } from "../utils/constants.js";
const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("password").notEmpty().withMessage("Password is required"),
    oneOf(
      [
        body("email").trim().isEmail().withMessage("Email is invalid"),
        body("username").trim().notEmpty().withMessage("Username is required"),
      ],
      {
        message: "Please provide a valid email or username",
      }
    ),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("assignedTo must be a valid user id"),
    body("status")
      .optional()
      .isIn(availableTaskStatus)
      .withMessage("Status is invalid"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title").optional().trim(),
    body("description").optional().trim(),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("assignedTo must be a valid user id"),
    body("status")
      .optional()
      .isIn(availableTaskStatus)
      .withMessage("Status is invalid"),
  ];
};

const createSubtaskValidator = () => {
  return [body("title").trim().notEmpty().withMessage("Title is required")];
};

const updateSubtaskValidator = () => {
  return [
    body("title").optional().trim(),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
  ];
};

const createNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

const updateNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(availableUserRoles)
      .withMessage("Role is invalid"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubtaskValidator,
  updateSubtaskValidator,
  createNoteValidator,
  updateNoteValidator,
};
