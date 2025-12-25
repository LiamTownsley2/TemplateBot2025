import path from 'path';
import { ExtendedClient } from './types/ExtendedClient';
import "./utils/Sentry";
import { logger } from './handlers/LogHandler';
import 'dotenv/config'
import registerProcessErrorHandlers from './utils/ProcessErrorHandlers';

const client: ExtendedClient = new ExtendedClient({
    command: path.join(__dirname, 'commands'),
    event: path.join(__dirname, 'events')
});

async function main() {
    await client.login(process.env.DISCORD_TOKEN);
}

try {
    main();
    registerProcessErrorHandlers(client);
} catch (error) {
    logger.error('Error starting the bot:', { error });
    process.exit(1);
}