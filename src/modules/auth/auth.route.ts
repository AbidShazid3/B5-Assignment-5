import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { loginZodSchema, resetPasswordZodValidation } from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

router.post('/login',
    validateRequest(loginZodSchema),
    AuthController.login);

router.post('/logout',
    AuthController.logout);

router.post('/reset-password',
    checkAuth(...Object.values(Role)),
    validateRequest(resetPasswordZodValidation),
    AuthController.resetPassword);

router.post('/refresh-token',
    AuthController.getNewAccessTokenFromRefreshToken);


export const AuthRoutes = router;