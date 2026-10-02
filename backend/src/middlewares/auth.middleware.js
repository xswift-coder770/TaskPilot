import { User } from "../models/user.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import asyncHandler from "../utils/async.handler.js";
import { ApiError } from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import mongoose from "mongoose";

//middleware to verify jwt access token
export const authMiddleware = asyncHandler(async (req, res, next) => {
  //extracting the accessToken from req object
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  //verifying token is there
  if (!token) {
    throw new ApiError(401, "Unauthorized request.");
  }

  //decoding the token
  try {
    const decodedToken = jwt.verify(token, config.jwt.accessTokenSecret);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    //verify jwt by decoding access token and update the request object with new values
    req.user = user;

    next();
  } catch (error) {  
    throw new ApiError(401, "Invalid access token");
  }
});


export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "project id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "project not found");
    }

    const givenRole = project.role;

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};

