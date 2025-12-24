import { ClientEvents } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';

export abstract class Event<K extends keyof ClientEvents> {
  protected client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  abstract name: K; // Event name
  abstract once: boolean; // True for 'once', false for 'on'
  abstract handle(...args: ClientEvents[K]): Promise<void> | void; // Event handler logic
}