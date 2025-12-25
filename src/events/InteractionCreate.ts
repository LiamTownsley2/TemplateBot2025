import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { CommandType } from '../types/interfaces/Command/Command';
import { ExtendedClient } from '../types/ExtendedClient';
import { Interaction } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { logger } from '../handlers/LogHandler';
import "../utils/Sentry";

export default class InteractionCreateEvent extends Event<'interactionCreate'> {
    public name = 'interactionCreate' as const;
    public once = false;

    constructor(client: ExtendedClient) {
        super(client);
        this.client = client;
    }

    public async handle(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = this.client.commands.filter(x => x.type == CommandType.Slash).get(interaction.commandName) as SlashCommand;
        if (!command) return;

        try {
            await command.execute(interaction);
            logger.commandExecuted();
        } catch (error) {
            const t = await this.client.getI18nForUser(interaction.user);

            logger.errorCommand(command.data.name, interaction.user.id, error as Error, { interactionId: interaction.id });
            const reply = { content: t('error_occured'), ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }
}