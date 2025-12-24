"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5ed80194-c113-5937-b104-e1a8bd23a3ea")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandType = void 0;
var CommandType;
(function (CommandType) {
    CommandType[CommandType["Slash"] = 0] = "Slash";
    CommandType[CommandType["Text"] = 1] = "Text";
})(CommandType || (exports.CommandType = CommandType = {}));
class Command {
    client;
    type;
    constructor(client, type) {
        this.client = client;
        this.type = type;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map
//# debugId=5ed80194-c113-5937-b104-e1a8bd23a3ea
