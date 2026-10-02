import { validationResult } from "express-validator";
import { ApiError } from "../utils/api.error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  console.log("Validation Errors:");
  console.log(errors.array());

  const extractedErrors = [];

  errors.array().forEach((err) => {
    extractedErrors.push({
      [err.path]: err.msg,
    });
  });

  throw new ApiError(422, "Received data is not valid", extractedErrors);
};