import { Message } from 'discord.js';
import { ExtendedClient } from '../types/ExtendedClient';
import { TextCommand } from '../types/interfaces/Command/TextCommand';

export default class TestCommand extends TextCommand {
    constructor(
        client: ExtendedClient,
    ) {
        super(client, 'test');
    }

    async execute(message: Message, args: string[]): Promise<void> {
        console.log(`Test command executed by ${message.author.tag} in guild ${message.guild?.name}`);

        await message.reply(`Test Success! Your arguments were: \`\`\`${args.map(((x, i) => `${i}. ${x}`)).join('\n')}\`\`\``);
    }
}