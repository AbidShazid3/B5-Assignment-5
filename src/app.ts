import express, { Application, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// app.use('/api', )

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World!, Welcome to Digital Wallet Server'
    })
})


export default app;