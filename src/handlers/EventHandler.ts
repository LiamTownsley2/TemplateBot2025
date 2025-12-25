// src/handlers/EventHandler.ts
import { readdirSync } from 'fs';
import path, { join } from 'path';
import { ClientEvents } from 'discord.js';
import { Event } from '../types/interfaces/Event';
import { ExtendedClient } from '../types/ExtendedClient';
import { readdir } from 'fs/promises';
import { logger } from './LogHandler';

export class EventHandler {
    private client: ExtendedClient;
    private directory: string;

    constructor(client: ExtendedClient, directory: string) {
        this.client = client;
        this.directory = directory;
        this.load();
    }

    public async load(): Promise<void> {
        logger.info('📥 Loading Events');
        const eventFiles = (await readdir(this.directory)).filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'base.ts');

        let loadedCount = 0;

        for (const file of eventFiles) {
            const filePath = path.join(this.directory, file);
            const eventModule = await import(filePath);
            const eventClass = eventModule.default;
            const event = new eventClass(this.client) as Event<keyof ClientEvents>; // Pass client here
            if (event.once) {
                this.client.once(event.name, (...args) => event.handle(...args));
            } else {
                this.client.on(event.name, (...args) => event.handle(...args));
            }

            logger.info(`ℹ️ Loaded event.`, { name: event.name, once: event.once });
            loadedCount++;
        }
        logger.info('✅ Events Loaded:', { count: loadedCount });
    }
}