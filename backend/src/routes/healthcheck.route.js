import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route('/').get(healthCheck);//home route /api/v1/ or api/v1
//we can add additional routes router.route("/users").get(getUsers); it will server /api/v1/users

export default router;