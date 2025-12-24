"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="55d63caa-10b0-502f-8b98-2626021b9210")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogHandler = void 0;
const winston_1 = __importDefault(require("winston"));
class LogHandler {
    logger;
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'logs/events.log' }),
            ],
        });
    }
    logEvent(eventName, info) {
        this.logger.info(`Event: ${eventName} - Info: ${info}`);
    }
    logError(eventName, error) {
        this.logger.error(`Event: ${eventName} - Error: ${error}`);
    }
}
exports.LogHandler = LogHandler;
//# sourceMappingURL=LogHandler.js.map
//# debugId=55d63caa-10b0-502f-8b98-2626021b9210
