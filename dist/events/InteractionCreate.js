"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="26e59402-56ac-52f8-b60e-acc7bbde91bb")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../types/interfaces/Event");
class InteractionCreateEvent extends Event_1.Event {
    name = 'interactionCreate';
    once = false;
    constructor(client) {
        super(client);
        this.client = client;
    }
    async handle(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        const command = this.client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            const reply = { content: 'There was an error executing this command!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            }
            else {
                await interaction.reply(reply);
            }
        }
    }
}
exports.default = InteractionCreateEvent;
//# sourceMappingURL=InteractionCreate.js.map
//# debugId=26e59402-56ac-52f8-b60e-acc7bbde91bb
