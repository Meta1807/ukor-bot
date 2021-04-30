import Discord from 'discord.js';
import Command from '../types/command';

const pong: Command = {
  name: "Pong",
  description: "Self explanatory.",
  execute: (message: Discord.Message, args: Array<string>) => {
    message.reply("Ping!");
  },
};

module.exports = pong;
