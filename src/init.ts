import Discord from 'discord.js';
import fs from 'fs';
import Command from './types/command';

const init = (commands: Discord.Collection<String, Command>) => {
  const files = fs
    .readdirSync('./src/commands')
    .filter((item) => item.endsWith(".ts") || item.endsWith(".js"));
  files.forEach((item) => {
    const command: Command = require(`./commands/${item.slice(0, -3)}`);
    commands.set(command.name.toLowerCase(), command);
  });
  return commands;
};

export default init;