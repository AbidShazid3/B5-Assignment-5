import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { registerUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post('/register', validateRequest(registerUserZodSchema), UserController.registerUser);
router.put('/update',checkAuth(...Object.values(Role)), validateRequest(updateUserZodSchema), UserController.updateUser);
router.get('/me', checkAuth(...Object.values(Role)), UserController.getMe);
router.get('/:id', checkAuth(...Object.values(Role)), UserController.getSingleUser);

export const UserRoutes = router;