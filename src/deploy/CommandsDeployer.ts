import {
    REST,
    Routes,
    Collection,
    RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js';
import { ExtendedClient } from '../types/ExtendedClient';
import { CommandType } from '../types/interfaces/Command/Command';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';

export class CommandsDeployer {
    private readonly client: ExtendedClient;
    private readonly rest: REST;

    constructor(client: ExtendedClient) {
        this.client = client;
        this.rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    }

    /**
     * Compares local commands with currently registered ones and deploys only if changed
     * @param guildId Optional guild ID for guild-specific commands (faster during dev)
     */
    public async deploy(guildId?: string): Promise<void> {
        if (!this.client.commands || this.client.commands.size === 0) {
            console.warn('⚠️ No commands loaded yet. Skipping deployment.');
            return;
        }

        const localCommands = this.getLocalCommandData();

        try {
            let currentCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

            if (guildId) {
                currentCommands = (await this.rest.get(
                    Routes.applicationGuildCommands(this.client.user!.id, guildId)
                )) as RESTPostAPIApplicationCommandsJSONBody[];
                console.log(`🔍 Fetched ${currentCommands.length} guild commands.`);
            } else {
                currentCommands = (await this.rest.get(
                    Routes.applicationCommands(this.client.user!.id)
                )) as RESTPostAPIApplicationCommandsJSONBody[];
                console.log(`🔍 Fetched ${currentCommands.length} global commands.`);
            }

            const hasChanges = this.hasCommandsChanged(localCommands, currentCommands);

            if (!hasChanges) {
                console.log('✅ Commands are up to date. No deployment needed.');
                return;
            }

            console.log('🔄 Changes detected. Deploying commands...');

            const route = guildId
                ? Routes.applicationGuildCommands(this.client.user!.id, guildId)
                : Routes.applicationCommands(this.client.user!.id);

            await this.rest.put(route, { body: localCommands });

            console.log(`🚀 Successfully deployed ${localCommands.length} commands ${guildId ? `to guild ${guildId}` : 'globally'}.`);
        } catch (error) {
            console.error('❌ Failed to deploy commands:', error);
        }
    }

    private getLocalCommandData(): RESTPostAPIApplicationCommandsJSONBody[] {
        return this.client.commands.filter((command) => command.type == CommandType.Slash).map((command) => (command as SlashCommand).data.toJSON());
    }

    private hasCommandsChanged(
        local: RESTPostAPIApplicationCommandsJSONBody[],
        remote: RESTPostAPIApplicationCommandsJSONBody[]
    ): boolean {
        // Convert to Maps for easier comparison
        const localMap = new Map(local.map((cmd) => [cmd.name, cmd]));
        const remoteMap = new Map(remote.map((cmd) => [cmd.name, cmd]));

        // Different count = changed
        if (localMap.size !== remoteMap.size) return true;

        // Compare each command deeply
        for (const [name, localCmd] of localMap) {
            const remoteCmd = remoteMap.get(name);
            if (!remoteCmd) return true; // Removed command

            if (!this.isCommandEqual(localCmd, remoteCmd)) return true;
        }

        return false;
    }

    private isCommandEqual(
        a: RESTPostAPIApplicationCommandsJSONBody,
        b: RESTPostAPIApplicationCommandsJSONBody
    ): boolean {
        // Deep comparison of relevant fields
        return (
            a.name === b.name &&
            (a as any).description === (b as any).description &&
            a.type === b.type &&
            JSON.stringify((a as any).options ?? []) === JSON.stringify((b as any).options ?? []) &&
            (a as any).dm_permission === (b as any).dm_permission &&
            (a as any).default_member_permissions === (b as any).default_member_permissions &&
            (a as any).nsfw === (b as any).nsfw
        );
    }
}