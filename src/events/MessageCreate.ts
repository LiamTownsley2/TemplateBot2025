import { TextCommand } from '../types/interfaces/Command/TextCommand';
import { CommandType } from '../types/interfaces/Command/Command';
import { ExtendedClient } from '../types/ExtendedClient';
import { Event } from '../types/interfaces/Event';
import { logger } from '../handlers/LogHandler';
import { Message } from 'discord.js';
import "../utils/Sentry";

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
            const t = await this.client.getI18nForUser(message.author);

            logger.errorCommand(commandName, message.author.id, error as Error, { messageId: message.id, args });
            const reply = { content: t('error_occured'), ephemeral: true };
            await message.reply(reply);
        }
    }
}