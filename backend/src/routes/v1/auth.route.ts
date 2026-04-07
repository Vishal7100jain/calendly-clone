import { Router } from "express";
import { LoginUser, RegisterUser } from "../../controllers/auth.controller";
import { validateData } from "../../middleware/validation.middleware";
import { LoginSchema, RegisterSchema } from "../../schema/auth.schema";

const authRootRoutes = Router();

// POST /api/v1/auth/register
authRootRoutes.post(
  "/register",
  validateData({ body: RegisterSchema }),
  RegisterUser
);

// POST /api/v1/auth/login
authRootRoutes.post("/login", validateData({ body: LoginSchema }), LoginUser);

export default authRootRoutes;
