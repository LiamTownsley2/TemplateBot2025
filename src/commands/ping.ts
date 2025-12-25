import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { ExtendedClient } from '../types/ExtendedClient';
import { logger } from '../handlers/LogHandler';
import { prisma } from '../utils/Prisma';

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
        await prisma.users.create({
            data: {
                id: BigInt(interaction.user.id),
                created_at: interaction.user.createdAt,
                username: interaction.user.username,
                accent_color: interaction.user.accentColor,
                avatar: interaction.user.displayAvatarURL({ forceStatic: false, extension: 'png', size: 1024 }),
                banner: interaction.user.bannerURL({ forceStatic: false, extension: 'png', size: 4096 }),
                global_name: interaction.user.globalName,
            }
        })

        const latency = this.client.ws.ping;
        await interaction.reply(`Pong! Latency: ${latency}ms`);
        logger.slashCommand(interaction, { latency: this.client.ws.ping });
    }
}