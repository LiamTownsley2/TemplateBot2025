import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { ExtendedClient } from "../../ExtendedClient";
import { Command, CommandType } from "./Command";

type SlashCommandBuilders = SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder

export abstract class SlashCommand extends Command {
    public data: SlashCommandBuilders;

    constructor(client: ExtendedClient, data: SlashCommandBuilders) {
        super(client, CommandType.Slash);
        this.data = data;
    }
    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
} 