import { ClientEvents } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { ExtendedClient } from '../types/ExtendedClient';
import { CommandsDeployer } from '../deploy/CommandsDeployer';
import { logger } from '../handlers/LogHandler';

export default class ReadyEvent extends Event<'clientReady'> {
    name = 'clientReady' as const;
    once = true;

    constructor(client: ExtendedClient) {
        super(client);
    }

    handle(): void {
        logger.info('✅ Application started', { signed_in_user: this.client.user?.tag, bot_version: require('../../package.json').version || 'unknown' });
        logger.debug('ℹ️ Checking if Deploy_Commands is enabled', { DEPLOY_COMMANDS: process.env.DEPLOY_COMMANDS });
        if (process.env.DEPLOY_COMMANDS === 'true') {
            new CommandsDeployer(this.client).deploy(process.env.TEST_GUILD_ID!).then(() => {
                logger.info('✅ Global slash commands deployed successfully.');
            }).catch((error: any) => {
                logger.error('❌ Error deploying global slash commands:', { error });
            });
        }
    }
}