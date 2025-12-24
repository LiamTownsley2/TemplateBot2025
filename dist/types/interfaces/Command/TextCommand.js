"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9835cc59-23e8-58d4-8aa5-88e627308958")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCommand = void 0;
const Command_1 = require("./Command");
class TextCommand extends Command_1.Command {
    name;
    constructor(client, name) {
        super(client, Command_1.CommandType.Text);
        this.name = name;
    }
}
exports.TextCommand = TextCommand;
//# sourceMappingURL=TextCommand.js.map
//# debugId=9835cc59-23e8-58d4-8aa5-88e627308958
