import Discord from 'discord.js';
import Command from '../types/command';

const ping: Command = {
  name: "Ping",
  description: "Self explanatory.",
  execute: (message: Discord.Message, args: Array<string>) => {
    message.reply("Pong!");
  },
};

module.exports = ping;
