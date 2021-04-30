import { Client, Message, Collection} from 'discord.js';
import Command from './types/command';

const router = (client: Client, message: Message, commands: Collection<string, Command>) => {
  const args = message.content.slice(process.env.DISCORD_PREFIX.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();
  const command: Command = commands.get(commandName);

  if (command) {
    try {
      command.execute(message, args);
    }
    catch {
      message.channel.send("An error has occurred while executing this command!");
    }
  }
};

export default router;