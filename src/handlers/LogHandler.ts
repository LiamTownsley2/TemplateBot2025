import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import SentryTransport from 'winston-transport-sentry-node';
import * as Sentry from "@sentry/node"
import "../utils/Sentry";

const isProduction = process.env.NODE_ENV === 'production';

export class LogHandler {
    private static instance: LogHandler;
    private logger: winston.Logger;

    private constructor() {
        const jsonFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.errors({ stack: true }), // Capture full stack traces
            winston.format.splat(),
            winston.format.json()
        );

        const consoleFormat = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf(
                ({ timestamp, level, message, ...meta }) =>
                    `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
            )
        );

        this.logger = winston.createLogger({
            level: isProduction ? 'info' : 'debug',
            format: jsonFormat,
            defaultMeta: { service: require('../../package.json').name }, // Add app name, version, etc.
            transports: [
                // Console (colored in dev, plain in prod)
                new winston.transports.Console({
                    format: isProduction ? jsonFormat : consoleFormat,
                }),

                // All logs - daily rotation
                new DailyRotateFile({
                    dirname: 'logs',
                    filename: 'combined-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '100m',     // Rotate when file reaches 100MB
                    maxFiles: '30d',     // Keep 30 days of logs
                }),

                // Errors only - separate file for alerting
                new DailyRotateFile({
                    dirname: 'logs',
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '50m',
                    maxFiles: '90d',
                    level: 'error',
                }),
            ],
            exceptionHandlers: [
                new DailyRotateFile({
                    dirname: 'logs',
                    filename: 'exceptions-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxFiles: '30d',
                }),
            ],
            rejectionHandlers: [
                new DailyRotateFile({
                    dirname: 'logs',
                    filename: 'rejections-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxFiles: '30d',
                }),
            ],
        });

        // Add Sentry transport (only errors/warnings by default)
        if (process.env.SENTRY_DSN) {
            this.logger.add(
                new SentryTransport({
                    sentry: {
                        dsn: process.env.SENTRY_DSN,
                    },
                    level: 'warn', // Only send error level logs to Sentry
                })
            );
        }
    }

    public static getInstance(): LogHandler {
        if (!LogHandler.instance) {
            LogHandler.instance = new LogHandler();
        }
        return LogHandler.instance;
    }

    private getLogger() {
        return this.logger;
    }

    public info(message: string, meta?: Record<string, any>) {
        this.getLogger().info(message, meta);
        Sentry.logger.info(message, meta);
    }

    public debug(message: string, meta?: Record<string, any>) {
        this.getLogger().debug(message, meta);
        Sentry.logger.debug(message, meta);
    }

    public warn(message: string, meta?: Record<string, any>) {
        this.getLogger().warn(message, meta);
        Sentry.logger.warn(message, meta);
    }

    public error(message: string | Error, meta?: Record<string, any>) {
        if (message instanceof Error) {
            this.getLogger().error(message.message, { ...meta, stack: message.stack });
            Sentry.logger.error(message.message, { ...meta, stack: message.stack })

        } else {
            this.getLogger().error(message, meta);
            Sentry.logger.error(message, meta)
        }
    }

    public fatal(message: string | Error, meta?: Record<string, any>) {
        this.error(message, meta);
        const messageStr = message instanceof Error ? message.message : message;
        Sentry.logger.fatal(messageStr, meta);

    }

    public trace(message: string, meta?: Record<string, any> | any[], attributes?: Record<string, any>) {
        if (Array.isArray(meta)) {
            this.getLogger().debug(message, attributes);
            Sentry.logger.trace(message, meta, attributes);
        } else {
            this.getLogger().debug(message, meta);
            Sentry.logger.trace(message, meta);
        }
    }
}

export const logger = LogHandler.getInstance();

export default LogHandler.getInstance();