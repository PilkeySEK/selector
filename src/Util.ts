import { AttachmentBuilder } from "discord.js";

export function createIDSelectorFile(
  arr: MapIterator<string> | Array<string>,
  filename?: string,
): AttachmentBuilder {
  const _arr = Array.from(arr);
  return new AttachmentBuilder(Buffer.from(_arr.join("\n")), {
    name: filename === undefined ? "selected_users.txt" : filename,
  });
}
