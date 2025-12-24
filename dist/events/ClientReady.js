"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c36604a9-a7f8-5a52-8022-7d72ef45b7ba")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../types/interfaces/Event");
const CommandsDeployer_1 = require("../deploy/CommandsDeployer");
class ReadyEvent extends Event_1.Event {
    name = 'clientReady';
    once = true;
    constructor(client) {
        super(client);
    }
    handle() {
        console.log(`✅ Client is ready:`, this.client.user?.tag);
        if (process.env.DEPLOY_COMMANDS === 'true') {
            new CommandsDeployer_1.CommandsDeployer(this.client).deploy(process.env.TEST_GUILD_ID).then(() => {
                console.log('✅ Global slash commands deployed successfully.');
            }).catch((error) => {
                console.error('❌ Error deploying global slash commands:', error);
            });
        }
    }
}
exports.default = ReadyEvent;
//# sourceMappingURL=ClientReady.js.map
//# debugId=c36604a9-a7f8-5a52-8022-7d72ef45b7ba
