import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";


const router = Router();

router.get('/my-transaction', checkAuth(Role.USER, Role.AGENT), TransactionController.getMyTransactions)

export const TransactionRoutes = router;