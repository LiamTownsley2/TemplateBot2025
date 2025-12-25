import { ClientEvents } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';

export abstract class Event<K extends keyof ClientEvents> {
  protected client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  abstract name: K;
  abstract once: boolean;
  abstract handle(...args: ClientEvents[K]): Promise<void> | void;
}