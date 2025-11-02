import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validationRequest";
import { loginZodSchema, resetPasswordZodValidation } from "./auth.validation";


const router = Router();

router.post('/login',
    validateRequest(loginZodSchema),
    AuthController.login);

router.post('/logout',
    AuthController.logout);

router.post('/reset-password',
    validateRequest(resetPasswordZodValidation),
    AuthController.resetPassword);

router.post('/refresh-token',
    AuthController.getNewAccessTokenFromRefreshToken);


export const AuthRoutes = router;