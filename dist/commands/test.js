"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a5377f76-1b2d-52d9-87e7-1c42c9078b8a")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const TextCommand_1 = require("../types/interfaces/Command/TextCommand");
class TestCommand extends TextCommand_1.TextCommand {
    constructor(client) {
        super(client, 'test');
    }
    async execute(message, args) {
        console.log(`Test command executed by ${message.author.tag} in guild ${message.guild?.name}`);
        await message.reply(`Test Success! Your arguments were: \`\`\`${args.map(((x, i) => `${i}. ${x}`)).join('\n')}\`\`\``);
    }
}
exports.default = TestCommand;
//# sourceMappingURL=test.js.map
//# debugId=a5377f76-1b2d-52d9-87e7-1c42c9078b8a
