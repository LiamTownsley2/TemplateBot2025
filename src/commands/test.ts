import { TextCommand } from '../types/interfaces/Command/TextCommand';
import { ExtendedClient } from '../types/ExtendedClient';
import { codeBlock, Message } from 'discord.js';
import { logger } from '../handlers/LogHandler';

export default class TestCommand extends TextCommand {
    constructor(
        client: ExtendedClient,
    ) {
        super(client, 'test');
    }

    async execute(message: Message, args: string[]): Promise<void> {
        const t = await this.client.getI18nForUser(message.author);

        await message.reply(t('test', { codeblock: codeBlock(args.map(((x, i) => `${i}. ${x}`)).join('\n')) }));
        logger.command(this.name, message.author.id, { arguments: args });
    }
}