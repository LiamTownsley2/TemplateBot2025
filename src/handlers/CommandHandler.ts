import { Command, CommandType } from '../types/interfaces/Command/Command';
import { SlashCommand } from '../types/interfaces/Command/SlashCommand';
import { TextCommand } from '../types/interfaces/Command/TextCommand';
import { ExtendedClient } from '../types/ExtendedClient';
import { readdir } from 'fs/promises';
import { logger } from './LogHandler';
import { join } from 'path';

export class CommandHandler {
    private readonly client: ExtendedClient;
    private readonly directory: string;

    constructor(client: ExtendedClient, directory: string) {
        this.client = client;
        this.directory = directory;
        this.load();
    }

    public async load() {
        logger.info('📥 Loading Commands');

        let loadedCount = 0;
        const commandFiles = (await readdir(this.directory)).filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'base.ts');
        for (const file of commandFiles) {
            const filePath = join(this.directory, file);
            const commandModule = await import(filePath);
            const commandClass = commandModule.default;
            const command = new commandClass(this.client) as Command;
            let commandName: string | undefined;

            switch (command.type) {
                case CommandType.Slash:
                    const slashCommand = command as SlashCommand;
                    commandName = slashCommand.data.name;
                    break;
                case CommandType.Text:
                    const textCommand = command as TextCommand;
                    commandName = textCommand.name
                    break;
            }
            this.client.commands.set(commandName, command);

            loadedCount++;
            logger.info(`ℹ️ Loaded command.`, { name: commandName });
        }
        logger.info('✅ Commands Loaded:', { count: loadedCount });
    }
}