import { Message } from "discord.js";
import { ExtendedClient } from "../../ExtendedClient";
import { Command, CommandConfig, CommandType } from "./Command";

export abstract class TextCommand extends Command {
    public name: string;

    constructor(client: ExtendedClient, name: string, config?: CommandConfig) {
        super(client, CommandType.Text, config);
        this.name = name;
    }
    abstract execute(message: Message, args: string[]): Promise<void>;
}