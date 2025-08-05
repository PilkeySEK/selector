import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { members_all } from "./members/All";
import { members_search } from "./members/Search";

export default {
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const subcmd = interaction.options.getSubcommand();

    switch (subcmd) {
      case "all":
        await members_all(interaction);
        break;
      case "search":
        await members_search(interaction);
        break;
      default:
        break;
    }
  },
  data: new SlashCommandBuilder()
    .setName("members")
    .setDescription("Select server members")
    .addSubcommand((subcommand) =>
      subcommand.setName("all").setDescription("Select all members"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search members based on a text query")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query").setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("limit")
            .setDescription(
              "Maximum amount of members to find. Defaults to 100",
            )
            .setMinValue(1)
            .setRequired(false),
        ),
    ),
};
