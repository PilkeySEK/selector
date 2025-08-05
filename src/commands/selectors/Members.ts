import {
  Collection,
  CommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { createIDSelectorFile } from "../../Util";

export default {
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const subcmd = interaction.options.getSubcommand();
    if (interaction.guild === null) {
      interaction.reply("You can only run this command in a server.");
      return;
    }
    if (subcmd === "all") {
      const beforeTimestamp = Date.now();
      let members: Collection<string, GuildMember>;
      try {
        members = await interaction.guild.members.fetch({ time: 30_000 });
      } catch (e) {
        interaction.reply({
          content: `Error: ${e}`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      const afterTimestamp = Date.now();
      const selectedUsers = createIDSelectorFile(members.keys());
      interaction.reply({
        content: `Found ${members.size} members in ${afterTimestamp - beforeTimestamp} ms.`,
        files: [selectedUsers],
      });
    } else if (subcmd === "search") {
      const query = interaction.options.get("query", true).value as string;
      const limitOption = interaction.options.get("limit");
      const limit = limitOption === null ? 100 : (limitOption.value as number);
      const beforeTimestamp = Date.now();
      let members: Collection<string, GuildMember>;
      try {
        members = await interaction.guild.members.fetch({
          time: 30_000,
          query: query,
          limit: limit,
        });
      } catch (e) {
        interaction.reply({
          content: `Error: ${e}`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      const afterTimestamp = Date.now();
      const selectedUsers = createIDSelectorFile(members.keys());
      interaction.reply({
        content: `Found ${members.size} members in ${afterTimestamp - beforeTimestamp} ms.`,
        files: [selectedUsers],
      });
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
