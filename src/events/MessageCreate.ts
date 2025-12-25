import { Message } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { ExtendedClient } from '../types/ExtendedClient';
import { TextCommand } from '../types/interfaces/Command/TextCommand';
import * as Sentry from "@sentry/node"
import "../utils/Sentry";
import { CommandType } from '../types/interfaces/Command/Command';
import { logger } from '../handlers/LogHandler';

export default class MessageCreateEvent extends Event<'messageCreate'> {
    public name = 'messageCreate' as const;
    public once = false;

    constructor(client: ExtendedClient) {
        super(client);
        this.client = client;
    }

    public async handle(message: Message) {
        if (!message.content.startsWith(process.env.PREFIX!)) return;
        if (!message.guild || message.author.bot) return;

        const args = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/);

        const commandName = args.shift()!.toLowerCase();
        const command = this.client.commands.filter(x => x.type == CommandType.Text).get(commandName) as TextCommand;
        if (!command) return;
        try {
            await command.execute(message, args);
            logger.commandExecuted();
        } catch (error) {
            logger.errorCommand(commandName, message.author.id, error as Error, { messageId: message.id, args });
            const reply = { content: 'There was an error executing this command!', ephemeral: true };
            await message.reply(reply);
        }
    }
}