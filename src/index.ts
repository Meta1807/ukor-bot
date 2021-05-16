import Discord from 'discord.js';
import dotenv from 'dotenv';
import http from './http';
import init from './init';
import router from './router';
import Command from './types/command';
import { nanoid } from 'nanoid';
// Initialize enviroment variables
dotenv.config();

const client = new Discord.Client();
const commands: Discord.Collection<string, Command> = new Discord.Collection();
const verifyRequests: Discord.Collection<string, Discord.GuildMember> = new Discord.Collection();

client.once('ready', () => {
  init(commands);
  console.log("Bot is logged in!");
});

client.on('message', (message: Discord.Message) => {
  if (!message.content.startsWith(process.env.DISCORD_PREFIX)) 
    return;
  // Pass message to command router
  router(client, message, commands);
});

// client.on('guildMemberAdd', (member: Discord.GuildMember) => {
//   const identifier = nanoid();
//   verifyRequests.set(identifier, member);
//   member.send(`
//     Selamat datang di UKOR Fasilkom UI! Silahkan melakukan verifikasi akun SSO UI dengan
//     membuka tautan berikut ini: ${process.env.SERVICE_URI || "https://localhost:3000"}/verify/${identifier}
//   `);
// });

client.login(process.env.DISCORD_TOKEN);

http(client, verifyRequests);

// Export verifyRequests for use in other files
export { verifyRequests }
