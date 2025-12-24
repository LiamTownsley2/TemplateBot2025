import { Interaction } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { ExtendedClient } from '../types/ExtendedClient';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';

export default class InteractionCreateEvent extends Event<'interactionCreate'> {
    public name = 'interactionCreate' as const;
    public once = false;

    constructor(client: ExtendedClient) {
        super(client);
        this.client = client;
    }

    public async handle(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = this.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await (command as SlashCommand).execute(interaction);
        } catch (error) {
            console.error(error);
            const reply = { content: 'There was an error executing this command!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }
}