import winston from 'winston';

export class LogHandler {
    private logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/events.log' }),
            ],
        });
    }

    public logEvent(eventName: string, info: string) {
        this.logger.info(`Event: ${eventName} - Info: ${info}`);
    }

    public logError(eventName: string, error: string) {
        this.logger.error(`Event: ${eventName} - Error: ${error}`);
    }


}