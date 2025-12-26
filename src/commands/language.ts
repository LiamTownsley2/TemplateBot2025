import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { ExtendedClient } from '../types/ExtendedClient';
import { logger } from '../handlers/LogHandler';
import { getI18n } from '../utils/I18n';
import { prisma } from '../utils/Prisma';
import { getUser } from '../utils/User';

const languages = [{ name: 'English', value: 'en-GB' }, { name: 'French', value: 'fr-FR' }];
export default class LanguageCommand extends SlashCommand {
    constructor(
        client: ExtendedClient,
        data = new SlashCommandBuilder()
            .setName('language')
            .setDescription('Configure the language settings on the bot.')
            .addSubcommand((opt) => opt
                .setName('get')
                .setDescription('Get the current langauge')
            )
            .addSubcommand((opt) => opt
                .setName('set')
                .setDescription('Set the language')
                .addStringOption((opt) => opt
                    .setName('name')
                    .setDescription('Name of the language')
                    .addChoices(languages)
                    .setRequired(true)
                )
            )
    ) {
        super(client, data);
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        switch (interaction.options.getSubcommand(true)) {
            case 'get':
                await this.get(interaction)
                break;
            case 'set':
                await this.set(interaction)
                break;
        }
    }

    private async get(interaction: ChatInputCommandInteraction): Promise<void> {
        const user = await getUser(interaction.user);
        const t = getI18n(user.locale).t;

        await interaction.reply(t('locale.current', { locale: user.locale }));
        logger.slashCommand(interaction, { locale: user.locale });
    }

    private async set(interaction: ChatInputCommandInteraction): Promise<void> {
        const user = await getUser(interaction.user);
        const t = getI18n(user.locale).t;

        const originalLocale = user.locale;
        const setLocale = interaction.options.getString('name', true);

        if (originalLocale == setLocale) {
            interaction.reply(t('locale.same_as_current', { locale: setLocale }))
            return
        }

        await prisma.user.update({
            where: { id: interaction.user.id },
            data: { locale: setLocale }
        });
        const nt = getI18n(setLocale).t;

        await interaction.reply(nt('locale.updated', { locale: setLocale }))
        logger.slashCommand(interaction, { from: originalLocale, to: setLocale });
    }
}