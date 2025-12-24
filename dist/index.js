"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9270ad4e-058f-52cf-b154-a152e4ab5040")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const EventHandler_1 = require("./handlers/EventHandler");
const CommandHandler_1 = require("./handlers/CommandHandler");
const LogHandler_1 = require("./handlers/LogHandler");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.commands = new discord_js_1.Collection();
client.events = new discord_js_1.Collection();
client.commandHandler = new CommandHandler_1.CommandHandler(client, path_1.default.join(__dirname, 'commands'));
client.eventHandler = new EventHandler_1.EventHandler(client, path_1.default.join(__dirname, 'events'));
client.logHandler = new LogHandler_1.LogHandler();
client.database = {};
client.config = {};
async function main() {
    await client.login();
}
main().catch(console.error);
//# sourceMappingURL=index.js.map
//# debugId=9270ad4e-058f-52cf-b154-a152e4ab5040
