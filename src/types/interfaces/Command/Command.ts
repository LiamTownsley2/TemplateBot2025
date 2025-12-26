import { ExtendedClient } from '../../ExtendedClient';

export enum CommandType { "Slash", "Text" }

type Cooldown = { type: "per_user" | "per_guild" | "global", length: number };
export type CommandConfig = { cooldown?: Cooldown }

export abstract class Command {
    protected client: ExtendedClient;
    public type: CommandType;
    public config?: CommandConfig;

    constructor(client: ExtendedClient, type: CommandType, config?: CommandConfig) {
        this.client = client;
        this.type = type;
        this.config = config;
    }
}