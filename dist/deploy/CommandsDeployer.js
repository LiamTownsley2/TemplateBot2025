"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0e65404d-1543-5bed-aaa5-dbfb5c790343")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsDeployer = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/interfaces/Command/Command");
class CommandsDeployer {
    client;
    rest;
    constructor(client) {
        this.client = client;
        this.rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    }
    async deploy(guildId) {
        if (!this.client.commands || this.client.commands.size === 0) {
            console.warn('⚠️ No commands loaded yet. Skipping deployment.');
            return;
        }
        const localCommands = this.getLocalCommandData();
        try {
            let currentCommands = [];
            if (guildId) {
                currentCommands = (await this.rest.get(discord_js_1.Routes.applicationGuildCommands(this.client.user.id, guildId)));
                console.log(`🔍 Fetched ${currentCommands.length} guild commands.`);
            }
            else {
                currentCommands = (await this.rest.get(discord_js_1.Routes.applicationCommands(this.client.user.id)));
                console.log(`🔍 Fetched ${currentCommands.length} global commands.`);
            }
            const hasChanges = this.hasCommandsChanged(localCommands, currentCommands);
            if (!hasChanges) {
                console.log('✅ Commands are up to date. No deployment needed.');
                return;
            }
            console.log('🔄 Changes detected. Deploying commands...');
            const route = guildId
                ? discord_js_1.Routes.applicationGuildCommands(this.client.user.id, guildId)
                : discord_js_1.Routes.applicationCommands(this.client.user.id);
            await this.rest.put(route, { body: localCommands });
            console.log(`🚀 Successfully deployed ${localCommands.length} commands ${guildId ? `to guild ${guildId}` : 'globally'}.`);
        }
        catch (error) {
            console.error('❌ Failed to deploy commands:', error);
        }
    }
    getLocalCommandData() {
        return this.client.commands.filter((command) => command.type == Command_1.CommandType.Slash).map((command) => command.data.toJSON());
    }
    hasCommandsChanged(local, remote) {
        const localMap = new Map(local.map((cmd) => [cmd.name, cmd]));
        const remoteMap = new Map(remote.map((cmd) => [cmd.name, cmd]));
        if (localMap.size !== remoteMap.size)
            return true;
        for (const [name, localCmd] of localMap) {
            const remoteCmd = remoteMap.get(name);
            if (!remoteCmd)
                return true;
            if (!this.isCommandEqual(localCmd, remoteCmd))
                return true;
        }
        return false;
    }
    isCommandEqual(a, b) {
        return (a.name === b.name &&
            a.description === b.description &&
            a.type === b.type &&
            JSON.stringify(a.options ?? []) === JSON.stringify(b.options ?? []) &&
            a.dm_permission === b.dm_permission &&
            a.default_member_permissions === b.default_member_permissions &&
            a.nsfw === b.nsfw);
    }
}
exports.CommandsDeployer = CommandsDeployer;
//# sourceMappingURL=CommandsDeployer.js.map
//# debugId=0e65404d-1543-5bed-aaa5-dbfb5c790343
