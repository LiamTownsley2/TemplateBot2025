import { Message } from "discord.js";
import { ExtendedClient } from "../../ExtendedClient";
import { Command, CommandType } from "./Command";

export abstract class TextCommand extends Command {
    public name: string;

    constructor(client: ExtendedClient, name: string) {
        super(client, CommandType.Text);
        this.name = name;
    }
    abstract execute(message: Message, args: string[]): Promise<void>;
}