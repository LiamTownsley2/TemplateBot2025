"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="78ed6fc4-7789-5670-b66a-4253e8632126")}catch(e){}}();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const Command_1 = require("../types/interfaces/Command/Command");
class CommandHandler {
    client;
    directory;
    constructor(client, directory) {
        this.client = client;
        this.directory = directory;
        this.load();
    }
    async load() {
        console.log('📥 Loading Commands');
        let loadedCount = 0;
        const commandFiles = (await (0, promises_1.readdir)(this.directory)).filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'base.ts');
        for (const file of commandFiles) {
            const filePath = (0, path_1.join)(this.directory, file);
            const commandModule = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            const commandClass = commandModule.default;
            const command = new commandClass(this.client);
            let commandName;
            switch (command.type) {
                case Command_1.CommandType.Slash:
                    const slashCommand = command;
                    commandName = slashCommand.data.name;
                    break;
                case Command_1.CommandType.Text:
                    const textCommand = command;
                    commandName = textCommand.name;
                    break;
            }
            this.client.commands.set(commandName, command);
            loadedCount++;
            console.info(`\tℹ️ Loaded command: ${commandName || 'Unnamed Command'}`);
        }
        console.log('✅ Commands Loaded:', loadedCount);
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map
//# debugId=78ed6fc4-7789-5670-b66a-4253e8632126
