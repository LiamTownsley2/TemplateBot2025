"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b56c0618-931a-545c-90b5-c4addd89b3f2")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = void 0;
const Command_1 = require("./Command");
class SlashCommand extends Command_1.Command {
    data;
    constructor(client, data) {
        super(client, Command_1.CommandType.Slash);
        this.data = data;
    }
}
exports.SlashCommand = SlashCommand;
//# sourceMappingURL=SlashCommand.js.map
//# debugId=b56c0618-931a-545c-90b5-c4addd89b3f2
