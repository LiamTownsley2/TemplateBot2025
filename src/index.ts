import registerProcessErrorHandlers from './utils/ProcessErrorHandlers';
import { ExtendedClient } from './types/ExtendedClient';
import { logger } from './handlers/LogHandler';
import path from 'path';
import "./utils/Sentry";
import 'dotenv/config'

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