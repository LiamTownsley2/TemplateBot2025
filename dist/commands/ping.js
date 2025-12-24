"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c41b9ad0-43bc-5524-89ed-793e7c1b6a70")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SlashCommand_1 = require("../types/interfaces/Command/SlashCommand");
class PingCommand extends SlashCommand_1.SlashCommand {
    constructor(client, data = new discord_js_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')) {
        super(client, data);
    }
    async execute(interaction) {
        console.log(`Ping command executed by ${interaction.user.tag} in guild ${interaction.guild?.name}`);
        const latency = this.client.ws.ping;
        await interaction.reply(`Pong! Latency: ${latency}ms`);
    }
}
exports.default = PingCommand;
//# sourceMappingURL=ping.js.map
//# debugId=c41b9ad0-43bc-5524-89ed-793e7c1b6a70
