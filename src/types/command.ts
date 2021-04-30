import { Message } from "discord.js";

export default interface Command {
  name: string,
  description?: string,
  execute: (message: Message, args: Array<string>) => void,
}