import path from 'path';
import { ExtendedClient } from './types/ExtendedClient';
import "./utils/Sentry";

const client: ExtendedClient = new ExtendedClient({
    command: path.join(__dirname, 'commands'),
    event: path.join(__dirname, 'events')
});

async function main() {
    await client.login();
}

main().catch(console.error);