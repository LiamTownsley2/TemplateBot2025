import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ExtendedClient } from "../../ExtendedClient";
import { Command, CommandType } from "./Command";

export abstract class SlashCommand extends Command {
    public data: SlashCommandBuilder;

    constructor(client: ExtendedClient, data: SlashCommandBuilder) {
        super(client, CommandType.Slash);
        this.data = data;
    }
    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}