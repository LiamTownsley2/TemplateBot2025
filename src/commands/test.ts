import { Message } from 'discord.js';
import { ExtendedClient } from '../types/ExtendedClient';
import { TextCommand } from '../types/interfaces/Command/TextCommand';
import * as Sentry from "@sentry/node"

export default class TestCommand extends TextCommand {
    constructor(
        client: ExtendedClient,
    ) {
        super(client, 'test');
    }

    async execute(message: Message, args: string[]): Promise<void> {
        console.log(`Test command executed by ${message.author.tag} in guild ${message.guild?.name}`);


        const Sentry = require("@sentry/node");
        try {
            throw new Error("Test error for Sentry");
        } catch (e) {
            Sentry.captureException(e);
        }
        await message.reply(`Test Success! Your arguments were: \`\`\`${args.map(((x, i) => `${i}. ${x}`)).join('\n')}\`\`\``);
    }
}