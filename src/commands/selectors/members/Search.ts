import { ChatInputCommandInteraction, Collection, GuildMember, MessageFlags } from "discord.js";
import { createIDSelectorFile } from "../../../Util";

export async function members_search(interaction: ChatInputCommandInteraction) {
    if (interaction.guild === null) {
      interaction.reply("You can only run this command in a server.");
      return;
    }
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