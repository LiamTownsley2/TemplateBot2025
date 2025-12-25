import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as Sentry from "@sentry/node"
import "../utils/Sentry";
import application_json from '../../package.json';
import os from 'os';
import { ChatInputCommandInteraction } from 'discord.js';
import Transport from 'winston-transport';

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
                    `${timestamp} [${level}]: ${message}\n${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
            )
        );

        const SentryTransport = Sentry.createSentryWinstonTransport(Transport, {
            levels: ['error', 'warn', 'info', 'debug', 'fatal', 'trace'],
        });

        this.logger = winston.createLogger({
            level: isProduction ? 'info' : 'debug',
            format: jsonFormat,
            defaultMeta: {
                service: application_json.name,
                version: application_json.version,
                pid: process.pid,
                hostname: os.hostname()
            },
            transports: [
                new SentryTransport(),
                // Console (colored in dev, plain in prod)
                new winston.transports.Console({
                    format: process.env.PRETTY_CONSOLE ? consoleFormat : jsonFormat,
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
    }

    public debug(message: string, meta?: Record<string, any>) {
        this.getLogger().debug(message, meta);
    }

    public warn(message: string, meta?: Record<string, any>) {
        this.getLogger().warn(message, meta);
    }

    public error(message: string | Error, meta?: Record<string, any>) {
        if (message instanceof Error) {
            this.getLogger().error(message.message, { ...meta, stack: message.stack });

        } else {
            this.getLogger().error(message, meta);
        }
    }

    public fatal(message: string | Error, meta?: Record<string, any>) {
        if (message instanceof Error) {
            this.getLogger().crit(message.message, { ...meta, stack: message.stack });
        } else {
            this.getLogger().crit(message, meta);
        }
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

    public command(name: string, userId: string, meta?: Record<string, any>) {
        this.getLogger().info(`Command: ${name}`, { userId, commandName: name, ...meta });
    }

    public slashCommand(interaction: ChatInputCommandInteraction, meta?: Record<string, any>) {
        this.command(
            interaction.commandName,
            interaction.user.id,
            {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                interactionId: interaction.id,
                options: interaction.options.data,
                ...meta,
            }
        );
    }

    public event(eventName: string, meta?: Record<string, any>) {
        this.getLogger().info(`Event: ${eventName}`, { eventName, ...meta });
    }

    public errorCommand(name: string, userId: string, error: Error, meta?: Record<string, any>) {
        this.getLogger().error(`Command failed: ${name}`, {
            userId,
            commandName: name,
            error: error.message,
            stack: error.stack,
            ...meta,
        });
    }

    public commandExecuted() {
        Sentry.metrics.count('command_executed', 1);
    }
}

export const logger = LogHandler.getInstance();

export default LogHandler.getInstance();