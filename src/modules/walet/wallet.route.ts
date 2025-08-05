import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validationRequest";
import { addMoneyZodSchema, cashInZodSchema, cashOutZodSchema, sendMoneyZodSchema, withdrawZodSchema } from "./wallet.validation";
import { WalletController } from "./wallet.controller";


const router = Router();

router.post('/send-money',
    checkAuth(Role.USER),
    validateRequest(sendMoneyZodSchema),
    WalletController.sendMoney);

router.post('/withdraw',
  checkAuth(Role.USER),
  validateRequest(withdrawZodSchema),
  WalletController.withdraw);

router.post('/cash-out',
    checkAuth(Role.USER),
    validateRequest(cashOutZodSchema),
    WalletController.cashOut);

router.post('/add-money',
    checkAuth(Role.USER),
    validateRequest(addMoneyZodSchema),
    WalletController.addMoney);

router.post('/cash-in',
    checkAuth(Role.AGENT),
    validateRequest(cashInZodSchema),
    WalletController.cashIn);

router.get('/my-wallet', checkAuth(Role.USER, Role.AGENT), WalletController.getMyWallet);


export const WalletRoutes = router;