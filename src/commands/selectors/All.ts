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
    if (interaction.guild === null) {
      interaction.reply("You can only run this command in a server.");
      return;
    }
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
  },
  data: new SlashCommandBuilder()
    .setName("all")
    .setDescription("Select all server members"),
};
