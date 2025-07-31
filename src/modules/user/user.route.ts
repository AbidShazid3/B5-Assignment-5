import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { registerUserZodSchema } from "./user.validation";

const router = Router();

router.post('/register',validateRequest(registerUserZodSchema), UserController.registerUser)


export const UserRoutes = router;