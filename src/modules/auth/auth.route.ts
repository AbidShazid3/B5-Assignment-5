import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { loginZodSchema } from "./auth.validation";


const router = Router();

router.post('/login', validateRequest(loginZodSchema) ,AuthController.login);


export const AuthRoutes = router;