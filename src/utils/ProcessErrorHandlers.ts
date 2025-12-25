import { logger } from "@sentry/node";
import { ExtendedClient } from "../types/ExtendedClient";

export default function registerProcessErrorHandlers(client: ExtendedClient) {
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        logger.error('Unhandled Rejection at:', { promise, reason });
    });

    process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception thrown:', { error });
        process.exit(1);
    });

    process.on('SIGINT', () => {
        logger.info('Received SIGINT. Shutting down gracefully...');
        client.destroy();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        logger.info('Received SIGTERM. Shutting down gracefully...');
        client.destroy();
        process.exit(0);
    });
}