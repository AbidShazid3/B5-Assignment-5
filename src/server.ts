/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import { envVars } from './config/env';
import app from './app';

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to MongoDB Using Mongoose!!");
        server = app.listen(envVars.PORT, () => {
            console.log(`App is listening on port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

startServer()

process.on('SIGTERM', () => {
    console.log("SIGTERM Signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on('SIGINT', () => {
    console.log("SIGINT Signal received... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// unhandled rejection
process.on('unhandledRejection', (err) => {
    console.log("Unhandled rejection detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})