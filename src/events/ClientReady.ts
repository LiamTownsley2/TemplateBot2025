import { ClientEvents } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { ExtendedClient } from '../types/ExtendedClient';
import { CommandsDeployer } from '../deploy/CommandsDeployer';

export default class ReadyEvent extends Event<'clientReady'> {
    name = 'clientReady' as const;
    once = true;

    constructor(client: ExtendedClient) {
        super(client);
    }

    handle(): void {
        console.log(`✅ Client is ready:`, this.client.user?.tag);
        if (process.env.DEPLOY_COMMANDS === 'true') {
            new CommandsDeployer(this.client).deploy(process.env.TEST_GUILD_ID!).then(() => {
                console.log('✅ Global slash commands deployed successfully.');
            }).catch((error: any) => {
                console.error('❌ Error deploying global slash commands:', error);
            });
        }
    }
}