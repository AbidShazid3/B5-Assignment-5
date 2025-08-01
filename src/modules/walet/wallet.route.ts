import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validationRequest";
import { cashOutZodSchema, sendMoneyZodSchema } from "./wallet.validation";
import { WalletController } from "./wallet.controller";


const router = Router();

router.post('/send-money',
    checkAuth(Role.USER),
    validateRequest(sendMoneyZodSchema),
    WalletController.sendMoney);

router.post('/cash-out',
    checkAuth(Role.USER),
    validateRequest(cashOutZodSchema),
    WalletController.cashOut);


export const WalletRoutes = router;