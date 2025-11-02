import express, { Application, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { router } from "./routes";
import { envVars } from "./config/env";


const app: Application = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))


app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World!, Welcome to Digital Wallet Server'
    })
})

// global error and not found route
app.use(globalErrorHandler);
app.use(notFound);

export default app;