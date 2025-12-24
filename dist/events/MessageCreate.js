"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="529f6a12-d738-5a48-aee8-1857e505d15b")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../types/interfaces/Event");
class MessageCreateEvent extends Event_1.Event {
    name = 'messageCreate';
    once = false;
    constructor(client) {
        super(client);
        this.client = client;
    }
    async handle(message) {
        if (!message.content.startsWith(process.env.PREFIX))
            return;
        if (!message.guild || message.author.bot)
            return;
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = this.client.commands.get(commandName);
        if (!command)
            return;
        try {
            await command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            const reply = { content: 'There was an error executing this command!', ephemeral: true };
            await message.reply(reply);
        }
    }
}
exports.default = MessageCreateEvent;
//# sourceMappingURL=MessageCreate.js.map
//# debugId=529f6a12-d738-5a48-aee8-1857e505d15b
