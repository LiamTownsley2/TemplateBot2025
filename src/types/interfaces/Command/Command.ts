import { ExtendedClient } from '../../ExtendedClient';

export enum CommandType { "Slash", "Text" }

export abstract class Command {
    protected client: ExtendedClient;
    public type: CommandType;

    constructor(client: ExtendedClient, type: CommandType) {
        this.client = client;
        this.type = type;
    }
}