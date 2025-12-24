import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { ExtendedClient } from '../types/ExtendedClient';

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
        console.log(`Ping command executed by ${interaction.user?.tag || interaction.user?.displayName} in guild ${interaction.guild?.name}`);
        const latency = this.client.ws.ping;
        await interaction.reply(`Pong! Latency: ${latency}ms`);
    }
}