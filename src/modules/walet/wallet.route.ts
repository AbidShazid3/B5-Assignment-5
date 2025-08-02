import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validationRequest";
import { cashInZodSchema, cashOutZodSchema, sendMoneyZodSchema } from "./wallet.validation";
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

router.post('/cash-in',
    checkAuth(Role.AGENT),
    validateRequest(cashInZodSchema),
    WalletController.cashIn);

router.get('/my-wallet', checkAuth(Role.USER, Role.AGENT), WalletController.getMyWallet);

router.get('/my-transaction', checkAuth(Role.USER, Role.AGENT), WalletController.getMyTransactions)


export const WalletRoutes = router;