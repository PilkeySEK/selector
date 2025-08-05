import {
  CommandInteraction,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { client_id, token } from "../config.json";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function deploy() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const commands:
    | RESTPostAPIChatInputApplicationCommandsJSONBody[]
    | unknown[] = [];
  const foldersPath = path.join(__dirname, "..", "src", "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command: {
        data: SlashCommandBuilder;
        execute: (interaction: CommandInteraction) => Promise<void>;
      } = (await import(filePath)).default;
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST().setToken(token);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data: Array<unknown> = (await rest.put(
        Routes.applicationCommands(client_id),
        { body: commands },
      )) as Array<unknown>;

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  })();
}
deploy();
