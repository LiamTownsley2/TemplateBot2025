import { Message } from 'discord.js';
import { ExtendedClient } from '../types/ExtendedClient';
import { TextCommand } from '../types/interfaces/Command/TextCommand';
import { logger } from '../handlers/LogHandler';

export default class TestCommand extends TextCommand {
    constructor(
        client: ExtendedClient,
    ) {
        super(client, 'test');
    }

    async execute(message: Message, args: string[]): Promise<void> {
        await message.reply(`Test Success! Your arguments were: \`\`\`${args.map(((x, i) => `${i}. ${x}`)).join('\n')}\`\`\``);
        logger.command(this.name, message.author.id, { arguments: args });
    }
}