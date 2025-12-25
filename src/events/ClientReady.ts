import { CommandsDeployer } from '../utils/CommandsDeployer';
import { ExtendedClient } from '../types/ExtendedClient';
import { Event } from '../types/interfaces/Event';
import { initI18nInstances } from '../utils/I18n';
import { logger } from '../handlers/LogHandler';

export default class ReadyEvent extends Event<'clientReady'> {
    name = 'clientReady' as const;
    once = true;

    constructor(client: ExtendedClient) {
        super(client);
    }

    public async handle(): Promise<void> {
        await initI18nInstances();

        logger.event('clientReady', {
            signed_in_user: `${this.client.user?.id}`,
            guilds: this.client.guilds.cache.size
        });

        logger.debug('ℹ️ Checking if DEPLOY_COMMANDS is enabled', { DEPLOY_COMMANDS: process.env.DEPLOY_COMMANDS });
        if (process.env.DEPLOY_COMMANDS === 'true') {
            try {
                await new CommandsDeployer(this.client).deploy(process.env.TEST_GUILD_ID!)
                logger.info('✅ Global slash commands deployed successfully.');
            } catch (error) {
                logger.error('❌ Error deploying global slash commands:', { error });
            }
        }
    }
}