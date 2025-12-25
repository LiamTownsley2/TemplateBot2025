import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { ExtendedClient } from '../types/ExtendedClient';
import { logger } from '../handlers/LogHandler';

export default class PingCommand extends SlashCommand {
    constructor(
        client: ExtendedClient,
        data: SlashCommandBuilder = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!')
    ) {
        super(client, data);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const t = await this.client.getI18nForUser(interaction.user);

        try {
            const sent = await interaction.reply(t('ping.request'));
            
            const message_latency = sent.createdTimestamp - interaction.createdTimestamp;
            const ws_latency = this.client.ws.ping;
            const latency = (message_latency > ws_latency) ? message_latency : ws_latency;

            await interaction.editReply(t('ping.response', { latency }));
            logger.slashCommand(interaction, { latency });
        } catch (error) {
            console.error(error);
            await interaction.reply(t('error_occured'));
        }
    }
}